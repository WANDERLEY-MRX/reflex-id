import { getEvidencesByUserId } from "@/lib/local-db";

export interface EvidenceFilters {
  userId?: string;
  type?: string;
  verificationStatus?: string;
}

export class EvidenceRepository {
  async findById(id: string) {
    return null;
  }

  async findByUserId(userId: string) {
    return getEvidencesByUserId(userId);
  }

  async findMany(filters: EvidenceFilters = {}) {
    const data = filters.userId ? getEvidencesByUserId(filters.userId) : [];
    return { data, total: data.length, page: 1, pageSize: 10, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }

  async create(data: any) {
    return data;
  }

  async update(id: string, data: any) {
    return data;
  }

  async delete(id: string) {}

  async countByUser(userId: string) {
    return getEvidencesByUserId(userId).length;
  }

  async getStats() {
    return { total: 0, pending: 0, verified: 0, rejected: 0 };
  }
}

export const evidenceRepo = new EvidenceRepository();
