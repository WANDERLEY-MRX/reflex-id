import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (redisClient) return redisClient;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (url && token) {
    redisClient = new Redis({ url, token });
    return redisClient;
  }
  
  // Mock in-memory para desenvolvimento local
  const mockStore = new Map<string, { value: string; expiresAt?: number }>();
  
  redisClient = {
    get: async (key: string) => {
      const item = mockStore.get(key);
      if (!item) return null;
      if (item.expiresAt && Date.now() > item.expiresAt) {
        mockStore.delete(key);
        return null;
      }
      try { return JSON.parse(item.value); } catch { return item.value; }
    },
    set: async (key: string, value: unknown, opts?: { ex?: number }) => {
      const expiresAt = opts?.ex ? Date.now() + opts.ex * 1000 : undefined;
      mockStore.set(key, { value: JSON.stringify(value), expiresAt });
      return "OK";
    },
    del: async (key: string) => { mockStore.delete(key); return 1; },
    incr: async (key: string) => {
      const item = mockStore.get(key);
      const val = item ? parseInt(item.value) + 1 : 1;
      mockStore.set(key, { value: String(val) });
      return val;
    },
    expire: async () => 1,
    ttl: async () => -1,
    keys: async () => [],
    pipeline: () => ({
      incr: function() { return this; },
      expire: function() { return this; },
      exec: async () => [],
    }),
  } as unknown as Redis;
  
  return redisClient;
}

export const redis = getRedisClient();

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300
): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    console.error(`Failed to cache key: ${key}`);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    console.error(`Failed to delete cache key: ${key}`);
  }
}

export async function cacheDeletePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    console.error(`Failed to delete cache pattern: ${pattern}`);
  }
}