"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { evidenceSchema, type EvidenceInput } from "@/schemas";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { generateHash } from "@/lib/utils";
import { UPLOADTHING_CONFIG } from "@/lib/upload";

export async function createEvidenceAction(data: EvidenceInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const validated = evidenceSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { title, description, type, url, source } = validated.data;

  const contentHash = generateHash(title + (description ?? "") + (url ?? ""));
  const existingEvidence = await db.evidence.findFirst({
    where: { fileHash: contentHash, userId: session.user.id },
  });

  if (existingEvidence) {
    return { success: false, error: "Evidência duplicada detectada" };
  }

  const evidence = await db.evidence.create({
    data: {
      userId: session.user.id,
      title,
      description,
      type,
      url,
      source,
      fileHash: contentHash,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "EVIDENCE_CREATED",
    resource: "evidence",
    resourceId: evidence.id,
  });

  revalidatePath("/evidence");
  return { success: true, data: evidence };
}

export async function uploadEvidenceFileAction(_file: File) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  if (!UPLOADTHING_CONFIG.allowedFileTypes.includes(_file.type as typeof UPLOADTHING_CONFIG.allowedFileTypes[number])) {
    return { success: false, error: "Tipo de arquivo não permitido" };
  }

  if (_file.size > UPLOADTHING_CONFIG.maxFileSize) {
    return { success: false, error: "Arquivo muito grande. Máximo de 10MB." };
  }

  return { success: true, message: "Arquivo válido para upload." };
}

export async function deleteEvidenceAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const evidence = await db.evidence.findUnique({ where: { id } });
  if (!evidence) {
    return { success: false, error: "Evidência não encontrada" };
  }

  if (evidence.userId !== session.user.id) {
    return { success: false, error: "Sem permissão para excluir esta evidência" };
  }

  await db.evidence.update({
    where: { id },
    data: { title: `${evidence.title} (excluída)` },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "EVIDENCE_DELETED",
    resource: "evidence",
    resourceId: id,
  });

  revalidatePath("/evidence");
  return { success: true, message: "Evidência removida!" };
}
