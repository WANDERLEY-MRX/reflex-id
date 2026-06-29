import { db } from "@/lib/db";
import type { Project } from "@prisma/client";
import type { ProjectWithUser, PaginatedResult } from "@/types";

export interface ProjectFilters {
  userId?: string;
  search?: string;
  technologies?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}

export class ProjectRepository {
  async findById(id: string): Promise<Project | null> {
    return db.project.findUnique({ where: { id } });
  }

  async findByIdWithUser(id: string): Promise<ProjectWithUser | null> {
    return db.project.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    }) as Promise<ProjectWithUser | null>;
  }

  async findByUserId(userId: string): Promise<Project[]> {
    return db.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findMany(
    filters: ProjectFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Project>> {
    const where: Record<string, unknown> = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) (where.createdAt as Record<string, unknown>).gte = filters.createdAfter;
      if (filters.createdBefore) (where.createdAt as Record<string, unknown>).lte = filters.createdBefore;
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.project.findMany({
        where: where as any,
        skip,
        take: pageSize,
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.project.count({ where: where as any }),
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

  async create(data: any): Promise<Project> {
    return db.project.create({ data });
  }

  async update(id: string, data: any): Promise<Project> {
    return db.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await db.project.delete({ where: { id } });
  }

  async countByUser(userId: string): Promise<number> {
    return db.project.count({ where: { userId } });
  }
}

export const projectRepo = new ProjectRepository();
