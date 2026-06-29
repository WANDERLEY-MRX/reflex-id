import { getUserById, getProfileByUserId } from "@/lib/local-db";

export class UserRepository {
  async findById(id: string) {
    const user = getUserById(id);
    if (!user) return null;
    const profile = getProfileByUserId(id);
    return { ...user, profile };
  }

  async findByEmail(email: string) {
    return null;
  }

  async findMany() {
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }

  async getStats() {
    return { total: 0, verified: 0, deleted: 0, recentLastWeek: 0 };
  }
}

export const userRepo = new UserRepository();
