import { db } from "@/lib/db";
import type { Evidence } from "@prisma/client";
import type { EvidenceWithRelations, PaginatedResult } from "@/types";

export interface EvidenceFilters {
  userId?: string;
  type?: string;
  verificationStatus?: string;
  confidenceLevel?: string;
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  hasFiles?: boolean;
}

export class EvidenceRepository {
  async findById(id: string): Promise<Evidence | null> {
    return db.evidence.findUnique({ where: { id } });
  }

  async findByIdWithRelations(id: string): Promise<EvidenceWithRelations | null> {
    return db.evidence.findUnique({
      where: { id },
      include: {
        files: true,
        validations: {
          include: { validator: true },
        },
        user: true,
        comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
      },
    }) as Promise<EvidenceWithRelations | null>;
  }

  async findByUserId(userId: string): Promise<Evidence[]> {
    return db.evidence.findMany({
      where: { userId },
      include: { files: true, validations: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findMany(
    filters: EvidenceFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResult<Evidence>> {
    const where: Record<string, unknown> = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.type) where.type = filters.type;
    if (filters.verificationStatus) {
      where.verificationStatus = filters.verificationStatus;
    }
    if (filters.confidenceLevel) {
      where.confidenceLevel = filters.confidenceLevel;
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
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
      db.evidence.findMany({
        where: where as any,
        skip,
        take: pageSize,
        include: { files: true, validations: true, user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.evidence.count({ where: where as any }),
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

  async create(data: any): Promise<Evidence> {
    return db.evidence.create({ data });
  }

  async update(id: string, data: any): Promise<Evidence> {
    return db.evidence.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await db.evidence.delete({ where: { id } });
  }

  async countByUser(userId: string): Promise<number> {
    return db.evidence.count({ where: { userId } });
  }

  async countByStatus(status: string): Promise<number> {
    return db.evidence.count({
      where: { verificationStatus: status },
    });
  }

  async getVerifiedCount(userId: string): Promise<number> {
    return db.evidence.count({
      where: { userId, verificationStatus: "VERIFIED" },
    });
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    verified: number;
    rejected: number;
  }> {
    const [total, pending, verified, rejected] = await Promise.all([
      db.evidence.count(),
      db.evidence.count({ where: { verificationStatus: "PENDING" } }),
      db.evidence.count({ where: { verificationStatus: "VERIFIED" } }),
      db.evidence.count({ where: { verificationStatus: "REJECTED" } }),
    ]);

    return { total, pending, verified, rejected };
  }
}

export const evidenceRepo = new EvidenceRepository();
