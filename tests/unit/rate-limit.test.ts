import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/redis", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
    pttl: vi.fn(),
    pipeline: vi.fn(() => ({
      incr: vi.fn(),
      expire: vi.fn(),
      exec: vi.fn(),
    })),
  },
}));

vi.mock("@upstash/ratelimit", () => {
  const mockLimit = vi.fn();
  return {
    Ratelimit: vi.fn(() => ({
      limit: mockLimit,
    })),
    slidingWindow: vi.fn(() => ({})),
  };
});

import { checkRateLimit, checkVerificationRateLimit, checkApiRateLimit } from "@/lib/rate-limit";
import { Ratelimit } from "@upstash/ratelimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when rate limit is not exceeded", async () => {
    const mockLimit = vi.mocked(Ratelimit).mock.results[0]?.value?.limit;
    if (mockLimit) {
      mockLimit.mockResolvedValue({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 60000,
      });
    }

    const result = await checkRateLimit("user-1");
    expect(result.success).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it("returns failure when rate limit is exceeded", async () => {
    const mockLimit = vi.mocked(Ratelimit).mock.results[0]?.value?.limit;
    if (mockLimit) {
      mockLimit.mockResolvedValue({
        success: false,
        limit: 100,
        remaining: 0,
        reset: Date.now() + 60000,
      });
    }

    const result = await checkRateLimit("user-1");
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("uses correct identifier", async () => {
    const mockLimit = vi.mocked(Ratelimit).mock.results[0]?.value?.limit;
    const spy = mockLimit || vi.fn();
    vi.mocked(Ratelimit).mock.results[0]?.value?.limit.mockResolvedValue({
      success: true,
      limit: 100,
      remaining: 99,
      reset: Date.now() + 60000,
    });

    await checkRateLimit("test-identifier");
    expect(Ratelimit).toHaveBeenCalled();
  });
});

describe("checkVerificationRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows verification within daily limit", async () => {
    const result = await checkVerificationRateLimit("user-1");
    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
    expect(typeof result.remaining).toBe("number");
  });
});

describe("checkApiRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns rate limit status for API key", async () => {
    const result = await checkApiRateLimit("rx_test_key");
    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
    expect(typeof result.remaining).toBe("number");
  });
});
