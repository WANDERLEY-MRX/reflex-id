import { db } from "@/lib/db";
import type { Project, Prisma } from "@prisma/client";
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
    const where: Prisma.ProjectWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.technologies && filters.technologies.length > 0) {
      where.technologies = { hasSome: filters.technologies };
    }
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) where.createdAt.gte = filters.createdAfter;
      if (filters.createdBefore) where.createdAt.lte = filters.createdBefore;
    }

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.project.findMany({
        where,
        skip,
        take: pageSize,
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.project.count({ where }),
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

  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return db.project.create({ data });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
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
