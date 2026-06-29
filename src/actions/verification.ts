"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { createAuditLog } from "@/lib/audit";
import { checkVerificationRateLimit } from "@/lib/rate-limit";
import { config } from "@/config";
import { revalidatePath } from "next/cache";

export async function requestVerificationAction(evidenceId: string, orgId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const rateCheck = await checkVerificationRateLimit(session.user.id);
  if (!rateCheck.success) {
    return { success: false, error: "Limite de solicitações diárias atingido" };
  }

  const evidence = await db.evidence.findUnique({ where: { id: evidenceId } });
  if (!evidence || evidence.userId !== session.user.id) {
    return { success: false, error: "Evidência não encontrada" };
  }

  if (evidence.verificationStatus !== "PENDING") {
    return { success: false, error: "Evidência já possui verificação em andamento" };
  }

  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    return { success: false, error: "Organização não encontrada" };
  }

  const existingRequest = await db.verificationRequest.findFirst({
    where: {
      requesterId: session.user.id,
      organizationId: orgId,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    return { success: false, error: "Já existe uma solicitação pendente para esta organização" };
  }

  const verificationRequest = await db.verificationRequest.create({
    data: {
      requesterId: session.user.id,
      organizationId: orgId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await db.evidence.update({
    where: { id: evidenceId },
    data: { verificationStatus: "SUBMITTED" },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "EVIDENCE_VERIFIED",
    resource: "evidence",
    resourceId: evidenceId,
    metadata: { verificationRequestId: verificationRequest.id, orgId },
  });

  revalidatePath("/verification");
  return { success: true, data: verificationRequest };
}

export async function approveVerificationAction(verificationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const request = await db.verificationRequest.findUnique({
    where: { id: verificationId },
    include: { organization: true },
  });

  if (!request) {
    return { success: false, error: "Solicitação não encontrada" };
  }

  const isOrgMember = await db.organizationMember.findFirst({
    where: { orgId: request.organizationId, userId: session.user.id },
  });

  if (!isOrgMember || (isOrgMember.role !== "ADMIN" && isOrgMember.role !== "OWNER")) {
    return { success: false, error: "Sem permissão para aprovar" };
  }

  if (request.status !== "PENDING") {
    return { success: false, error: "Solicitação já processada" };
  }

  if (request.expiresAt && request.expiresAt < new Date()) {
    await db.verificationRequest.update({
      where: { id: verificationId },
      data: { status: "EXPIRED" },
    });
    return { success: false, error: "Solicitação expirada" };
  }

  await db.$transaction([
    db.verificationRequest.update({
      where: { id: verificationId },
      data: { status: "APPROVED" },
    }),
    db.validation.create({
      data: {
        evidenceId: request.requesterId,
        validatorId: session.user.id,
        validatorType: "ORGANIZATION",
        status: "APPROVED",
        confidenceLevel: "HIGH",
      },
    }),
  ]);

  await createAuditLog({
    userId: session.user.id,
    action: "EVIDENCE_VERIFIED",
    resource: "verification",
    resourceId: verificationId,
  });

  revalidatePath("/verification");
  return { success: true, message: "Verificação aprovada!" };
}

export async function rejectVerificationAction(verificationId: string, reason: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const request = await db.verificationRequest.findUnique({
    where: { id: verificationId },
  });

  if (!request) {
    return { success: false, error: "Solicitação não encontrada" };
  }

  const isOrgMember = await db.organizationMember.findFirst({
    where: { orgId: request.organizationId, userId: session.user.id },
  });

  if (!isOrgMember || (isOrgMember.role !== "ADMIN" && isOrgMember.role !== "OWNER")) {
    return { success: false, error: "Sem permissão para rejeitar" };
  }

  if (!reason || reason.trim().length < 10) {
    return { success: false, error: "Forneça um motivo com pelo menos 10 caracteres" };
  }

  await db.$transaction([
    db.verificationRequest.update({
      where: { id: verificationId },
      data: { status: "REJECTED" },
    }),
    db.validation.create({
      data: {
        evidenceId: request.requesterId,
        validatorId: session.user.id,
        validatorType: "ORGANIZATION",
        status: "REJECTED",
        comment: reason,
        confidenceLevel: "LOW",
      },
    }),
  ]);

  await createAuditLog({
    userId: session.user.id,
    action: "EVIDENCE_REJECTED",
    resource: "verification",
    resourceId: verificationId,
    metadata: { reason },
  });

  revalidatePath("/verification");
  return { success: true, message: "Verificação rejeitada." };
}
