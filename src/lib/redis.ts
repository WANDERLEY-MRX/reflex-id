// Stub - Redis for MVP (no-op)

export async function cacheGet(_key: string): Promise<string | null> {
  return null;
}

export async function cacheSet(_key: string, _value: string, _ttl?: number): Promise<void> {
  // no-op
}

export async function cacheDelete(_key: string): Promise<void> {
  // no-op
}

export async function cacheDeletePattern(_pattern: string): Promise<void> {
  // no-op
}
