import { db } from "@/lib/db";
import type { Notification } from "@prisma/client";
import type { PaginatedResult } from "@/types";

export interface NotificationFilters {
  userId: string;
  type?: string;
  read?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export class NotificationRepository {
  async findById(id: string): Promise<Notification | null> {
    return db.notification.findUnique({ where: { id } });
  }

  async findMany(
    filters: NotificationFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResult<Notification>> {
    const where: Record<string, unknown> = { userId: filters.userId };

    if (filters.type) where.type = filters.type;
    if (filters.read !== undefined) where.read = filters.read;
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) (where.createdAt as Record<string, unknown>).gte = filters.createdAfter;
      if (filters.createdBefore) (where.createdAt as Record<string, unknown>).lte = filters.createdBefore;
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.notification.findMany({
        where: where as any,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      db.notification.count({ where: where as any }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page * pageSize < total,
      hasPreviousPage: page > 1,
    };
  }

  async create(data: any): Promise<Notification> {
    return db.notification.create({ data });
  }

  async createMany(data: any[]): Promise<void> {
    await db.notification.createMany({ data });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    return db.notification.update({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async markAsUnread(id: string, userId: string): Promise<Notification> {
    return db.notification.update({
      where: { id, userId },
      data: { read: false },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.notification.delete({ where: { id, userId } });
  }

  async deleteAll(userId: string): Promise<void> {
    await db.notification.deleteMany({ where: { userId } });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return db.notification.count({
      where: { userId, read: false },
    });
  }

  async getRecent(userId: string, limit: number = 5): Promise<Notification[]> {
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const notificationRepo = new NotificationRepository();
