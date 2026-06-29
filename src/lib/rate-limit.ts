import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
import { config } from "@/config";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getMemoryLimiter(maxRequests: number, windowMs: number) {
  return {
    limit: async (identifier: string) => {
      const now = Date.now();
      const key = identifier;
      const item = rateLimitStore.get(key);
      
      if (!item || now > item.resetAt) {
        rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: Math.floor((now + windowMs) / 1000) };
      }
      
      item.count++;
      const success = item.count <= maxRequests;
      return { success, limit: maxRequests, remaining: Math.max(0, maxRequests - item.count), reset: Math.floor(item.resetAt / 1000) };
    },
  };
}

export function getRateLimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  if (url) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.limits.rateLimitMaxRequests, `${config.limits.rateLimitWindow} s`),
      analytics: true,
      prefix: `${config.redis.prefix}ratelimit`,
    });
  }
  return getMemoryLimiter(config.limits.rateLimitMaxRequests, config.limits.rateLimitWindow * 1000);
}

const rateLimiter = getRateLimiter();

export async function checkRateLimit(identifier: string) {
  try {
    const result = await rateLimiter.limit(identifier);
    return { success: result.success, limit: result.limit, remaining: result.remaining, reset: result.reset };
  } catch {
    return { success: true, limit: config.limits.rateLimitMaxRequests, remaining: 1, reset: Math.floor(Date.now() / 1000) + config.limits.rateLimitWindow };
  }
}

export async function checkVerificationRateLimit(userId: string) {
  const identifier = `verification:${userId}`;
  try {
    const result = await rateLimiter.limit(identifier);
    return { success: result.success, remaining: result.remaining, reset: result.reset };
  } catch {
    return { success: true, remaining: 1, reset: Math.floor(Date.now() / 1000) + 86400 };
  }
}

export async function checkApiRateLimit(apiKey: string) {
  const identifier = `api:${apiKey}`;
  try {
    const result = await rateLimiter.limit(identifier);
    return { success: result.success, remaining: result.remaining, reset: result.reset };
  } catch {
    return { success: true, remaining: 1, reset: Math.floor(Date.now() / 1000) + 60 };
  }
}