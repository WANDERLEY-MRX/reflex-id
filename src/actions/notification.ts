"use server";

export async function getNotificationsAction() {
  return { success: true, data: [] };
}

export async function markNotificationReadAction(_id: string) {
  return { success: true };
}

export async function markAllNotificationsReadAction() {
  return { success: true };
}
