import { getNotificationsByUserId } from "@/lib/local-db";

export class NotificationRepository {
  async findById(id: string) { return null; }
  async findMany(filters: { userId: string }) {
    const data = getNotificationsByUserId(filters.userId);
    return { data, total: data.length, page: 1, pageSize: 20, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }
  async getUnreadCount(userId: string) {
    return getNotificationsByUserId(userId).filter((n) => !n.read).length;
  }
  async getRecent(userId: string, limit = 5) {
    return getNotificationsByUserId(userId).slice(0, limit);
  }
}

export const notificationRepo = new NotificationRepository();
