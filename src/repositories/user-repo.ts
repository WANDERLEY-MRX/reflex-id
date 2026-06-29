import { db } from "@/lib/db";
import type { User } from "@prisma/client";
import type { UserWithProfile, PaginatedResult } from "@/types";

export interface UserFilters {
  role?: string;
  search?: string;
  emailVerified?: boolean;
  deleted?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export class UserRepository {
  async findById(id: string): Promise<UserWithProfile | null> {
    return db.user.findUnique({
      where: { id, deletedAt: null },
      include: { profile: true },
    }) as Promise<UserWithProfile | null>;
  }

  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email, deletedAt: null },
    });
  }

  async findMany(
    filters: UserFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<User>> {
    const where: Record<string, unknown> = { deletedAt: null };

    if (filters.role) where.role = filters.role;
    if (filters.emailVerified !== undefined) {
      where.emailVerified = filters.emailVerified ? { not: null } : null;
    }
    if (filters.deleted) {
      delete where.deletedAt;
      where.deletedAt = { not: null };
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) (where.createdAt as Record<string, unknown>).gte = filters.createdAfter;
      if (filters.createdBefore) (where.createdAt as Record<string, unknown>).lte = filters.createdBefore;
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.user.findMany({
        where: where as any,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where: where as any }),
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

  async update(id: string, data: any): Promise<User> {
    return db.user.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<void> {
    await db.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<void> {
    await db.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async count(filters: UserFilters = {}): Promise<number> {
    const where: Record<string, unknown> = { deletedAt: null };
    if (filters.role) where.role = filters.role;
    return db.user.count({ where: where as any });
  }

  async getStats() {
    const [total, verified, deleted, recent] = await Promise.all([
      db.user.count({ where: { deletedAt: null } }),
      db.user.count({ where: { emailVerified: { not: null }, deletedAt: null } }),
      db.user.count({ where: { deletedAt: { not: null } } }),
      db.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          deletedAt: null,
        },
      }),
    ]);

    return { total, verified, deleted, recentLastWeek: recent };
  }
}

export const userRepo = new UserRepository();
