// Stub - services for MVP

export class ProfileService {
  async getByUserId(userId: string) { return null; }
  async getBySlug(slug: string) { return null; }
  async update(userId: string, data: any) { return data; }
}

export class EvidenceService {
  async getByUserId(userId: string) { return []; }
  async create(userId: string, data: any) { return data; }
}

export class VerificationService {
  async calculateConfidence(_validations: any[]) { return 0; }
}

export class AchievementService {
  async checkAndUnlock(_userId: string) { return []; }
}

export class AnalyticsService {
  async track(_event: string, _userId?: string, _properties?: any) {}
  async getStats() { return { totalUsers: 0, totalEvidences: 0 }; }
}
