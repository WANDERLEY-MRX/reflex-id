// Stub - service for MVP
export class EvidenceService {
  generateFileHash(_buffer: Buffer) { return "mock-hash"; }
  async getByUserId(_userId: string) { return []; }
}
