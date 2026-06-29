"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { skillSchema, skillUpdateSchema, type SkillInput } from "@/schemas";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { config } from "@/config";

export async function addSkillAction(data: SkillInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const validated = skillSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existingCount = await db.skill.count({ where: { userId: session.user.id } });
  if (existingCount >= config.limits.maxSkills) {
    return { success: false, error: `Limite máximo de ${config.limits.maxSkills} habilidades atingido` };
  }

  const existingSkill = await db.skill.findFirst({
    where: {
      userId: session.user.id,
      name: validated.data.name,
    },
  });

  if (existingSkill) {
    return { success: false, error: "Você já possui esta habilidade cadastrada" };
  }

  const skill = await db.skill.create({
    data: {
      userId: session.user.id,
      name: validated.data.name,
      category: validated.data.category,
      level: validated.data.level,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "SKILL_CREATED",
    resource: "skill",
    resourceId: skill.id,
  });

  revalidatePath("/profile");
  return { success: true, data: skill };
}

export async function updateSkillLevelAction(id: string, level: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  if (level < 1 || level > 5) {
    return { success: false, error: "Nível deve estar entre 1 e 5" };
  }

  const skill = await db.skill.findUnique({ where: { id } });
  if (!skill) {
    return { success: false, error: "Habilidade não encontrada" };
  }

  if (skill.userId !== session.user.id) {
    return { success: false, error: "Sem permissão para editar esta habilidade" };
  }

  await db.skill.update({ where: { id }, data: { level } });

  await createAuditLog({
    userId: session.user.id,
    action: "SKILL_UPDATED",
    resource: "skill",
    resourceId: id,
  });

  revalidatePath("/profile");
  return { success: true, message: "Nível atualizado!" };
}

export async function removeSkillAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const skill = await db.skill.findUnique({ where: { id } });
  if (!skill) {
    return { success: false, error: "Habilidade não encontrada" };
  }

  if (skill.userId !== session.user.id) {
    return { success: false, error: "Sem permissão para remover esta habilidade" };
  }

  await db.skill.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "SKILL_DELETED",
    resource: "skill",
    resourceId: id,
  });

  revalidatePath("/profile");
  return { success: true, message: "Habilidade removida!" };
}
