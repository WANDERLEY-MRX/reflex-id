"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { projectSchema, projectUpdateSchema, type ProjectInput, type ProjectUpdateInput } from "@/schemas";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createProjectAction(data: ProjectInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, description, technologies, images, links, results, skillsAcquired } = validated.data;

  const project = await db.project.create({
    data: {
      userId: session.user.id,
      name,
      description,
      technologies: Array.isArray(technologies) ? JSON.stringify(technologies) : technologies,
      images: images ? JSON.stringify(images) : undefined,
      links: links ? JSON.stringify(links) : undefined,
      results,
      skillsAcquired: Array.isArray(skillsAcquired) ? JSON.stringify(skillsAcquired) : skillsAcquired,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "PROJECT_CREATED",
    resource: "project",
    resourceId: project.id,
  });

  revalidatePath("/projects");
  return { success: true, data: project };
}

export async function updateProjectAction(id: string, data: ProjectUpdateInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const validated = projectUpdateSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const project = await db.project.findUnique({ where: { id } });
  if (!project) {
    return { success: false, error: "Projeto não encontrado" };
  }

  if (project.userId !== session.user.id) {
    return { success: false, error: "Sem permissão para editar este projeto" };
  }

  const { technologies, images, links, skillsAcquired, ...rest } = validated.data;
  const updated = await db.project.update({
    where: { id },
    data: {
      ...rest,
      technologies: technologies !== undefined ? JSON.stringify(technologies) : undefined,
      images: images !== undefined ? JSON.stringify(images) : undefined,
      links: links !== undefined ? JSON.stringify(links) : undefined,
      skillsAcquired: skillsAcquired !== undefined ? JSON.stringify(skillsAcquired) : undefined,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "PROJECT_UPDATED",
    resource: "project",
    resourceId: id,
  });

  revalidatePath("/projects");
  return { success: true, data: updated };
}

export async function deleteProjectAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const project = await db.project.findUnique({ where: { id } });
  if (!project) {
    return { success: false, error: "Projeto não encontrado" };
  }

  if (project.userId !== session.user.id) {
    return { success: false, error: "Sem permissão para excluir este projeto" };
  }

  await db.project.delete({ where: { id } });

  await createAuditLog({
    userId: session.user.id,
    action: "PROJECT_DELETED",
    resource: "project",
    resourceId: id,
  });

  revalidatePath("/projects");
  return { success: true, message: "Projeto excluído!" };
}
