"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth-config";
import { revalidatePath } from "next/cache";

export async function markAsReadAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  const notification = await db.notification.findUnique({ where: { id } });
  if (!notification) {
    return { success: false, error: "Notificação não encontrada" };
  }

  if (notification.userId !== session.user.id) {
    return { success: false, error: "Sem permissão" };
  }

  await db.notification.update({ where: { id }, data: { read: true } });

  revalidatePath("/notifications");
  return { success: true };
}

export async function markAllAsReadAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado" };
  }

  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/notifications");
  return { success: true, message: "Todas as notificações marcadas como lidas" };
}
