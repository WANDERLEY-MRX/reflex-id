import { getProfileByUserId, getProfileBySlug } from "@/lib/local-db";

export class ProfileRepository {
  async findById(id: string) { return null; }
  async findByUserId(userId: string) { return getProfileByUserId(userId); }
  async findBySlug(slug: string) { return getProfileBySlug(slug); }
  async findMany() {
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }
  async isSlugAvailable(slug: string) { return !getProfileBySlug(slug); }
  async getCompleteness(userId: string) { return 0; }
}

export const profileRepo = new ProfileRepository();
