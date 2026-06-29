import { getProjectsByUserId } from "@/lib/local-db";

export class ProjectRepository {
  async findById(id: string) { return null; }
  async findByUserId(userId: string) { return getProjectsByUserId(userId); }
  async findMany() {
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
  }
  async countByUser(userId: string) { return getProjectsByUserId(userId).length; }
}

export const projectRepo = new ProjectRepository();
