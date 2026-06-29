import { db } from "@/lib/db";
import type { User, Prisma } from "@prisma/client";
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
    const where: Prisma.UserWhereInput = { deletedAt: null };

    if (filters.role) where.role = filters.role as Prisma.EnumUserRoleFilter["equals"];
    if (filters.emailVerified !== undefined) {
      where.emailVerified = filters.emailVerified ? { not: null } : null;
    }
    if (filters.deleted) {
      delete where.deletedAt;
      where.deletedAt = { not: null };
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where }),
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

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
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
    const where: Prisma.UserWhereInput = { deletedAt: null };
    if (filters.role) where.role = filters.role as Prisma.EnumUserRoleFilter["equals"];
    return db.user.count({ where });
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
