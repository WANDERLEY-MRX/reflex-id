// Stub - service for MVP
export class AnalyticsService {
  async track(_event: string, _userId?: string, _properties?: any) {}
  async getStats() { return { totalUsers: 0, totalEvidences: 0 }; }
}
