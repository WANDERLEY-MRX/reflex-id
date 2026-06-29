// Stub - Rate limiting for MVP (no-op)

export async function checkRateLimit(_key: string): Promise<{ success: boolean; remaining?: number }> {
  return { success: true, remaining: 999 };
}
