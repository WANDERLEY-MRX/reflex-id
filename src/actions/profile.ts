"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { profileSchema, type ProfileInput } from "@/schemas";
import { createAuditLog } from "@/lib/audit";
import { UPLOADTHING_CONFIG } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: ProfileInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const validated = profileSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { slug, ...rest } = validated.data;

  const existingProfile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!existingProfile) {
    return { success: false, error: "Perfil não encontrado" };
  }

  if (slug !== existingProfile.slug) {
    const slugTaken = await db.profile.findUnique({ where: { slug } });
    if (slugTaken && slugTaken.userId !== session.user.id) {
      return { success: false, error: "Este slug já está em uso" };
    }
  }

  await db.profile.update({
    where: { userId: session.user.id },
    data: {
      slug,
      ...rest,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "PROFILE_UPDATED",
    resource: "profile",
    resourceId: existingProfile.id,
  });

  revalidatePath("/profile");
  return { success: true, message: "Perfil atualizado!" };
}

export async function updateAvatarAction(_file: File) {
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

  return { success: true, message: "Arquivo válido. Envie via UploadThing." };
}

export async function updateSlugAction(slug: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const slugRegex = /^[a-z0-9-]{3,50}$/;
  if (!slugRegex.test(slug)) {
    return { success: false, error: "Slug inválido. Use apenas letras minúsculas, números e hífens (3-50 caracteres)." };
  }

  const existing = await db.profile.findUnique({ where: { slug } });
  if (existing && existing.userId !== session.user.id) {
    return { success: false, error: "Este slug já está em uso" };
  }

  await db.profile.update({
    where: { userId: session.user.id },
    data: { slug },
  });

  revalidatePath("/profile");
  return { success: true, message: "Slug atualizado!" };
}
