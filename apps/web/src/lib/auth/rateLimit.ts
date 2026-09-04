import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  maxRequests: number; // e.g. 5 attempts
  windowSeconds: number; // e.g. 60 seconds
  action?: string; // e.g. "auth:login"
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

// In-memory sliding window cache per IP:action
const inMemoryCache = new Map<string, number[]>();

// Periodic garbage collection for memory cache
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of inMemoryCache.entries()) {
      const valid = timestamps.filter((t) => now - t < 120_000);
      if (valid.length === 0) {
        inMemoryCache.delete(key);
      } else {
        inMemoryCache.set(key, valid);
      }
    }
  }, 60_000);
  if (timer.unref) timer.unref();
}

/**
 * Extracts best-effort client IP from headers.
 */
export function getClientIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}

/**
 * Sliding Window Rate Limiter.
 * Uses Upstash REST API if configured; otherwise uses high-performance in-memory sliding window cache.
 */
export async function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig = { maxRequests: 5, windowSeconds: 60, action: "general" }
): Promise<RateLimitResult> {
  const ip = getClientIp(req);
  const action = config.action || "general";
  const key = `rl:${action}:${ip}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  // 1. Check if Upstash Redis REST credentials are provided
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      // Execute atomic sliding window via Upstash REST API
      const multiResp = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["ZREMRANGEBYSCORE", key, "0", (now - windowMs).toString()],
          ["ZCARD", key],
          ["ZADD", key, now.toString(), `${now}-${Math.random()}`],
          ["EXPIRE", key, config.windowSeconds.toString()],
        ]),
      });

      if (multiResp.ok) {
        const results = await multiResp.json();
        const currentCount = results[1]?.result ?? 0;
        const success = currentCount < config.maxRequests;
        return {
          success,
          limit: config.maxRequests,
          remaining: Math.max(0, config.maxRequests - currentCount - 1),
          resetInSeconds: config.windowSeconds,
        };
      }
    } catch (redisErr) {
      console.warn("[RateLimit]: Upstash Redis error, falling back to in-memory sliding window:", redisErr);
    }
  }

  // 2. Local Sliding Window Memory Fallback
  const timestamps = inMemoryCache.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= config.maxRequests) {
    const oldest = validTimestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetInSeconds,
    };
  }

  validTimestamps.push(now);
  inMemoryCache.set(key, validTimestamps);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - validTimestamps.length,
    resetInSeconds: config.windowSeconds,
  };
}

/**
 * Standard 429 Too Many Requests response with HTTP RateLimit headers.
 */
export function rateLimitExceededResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: `Too many requests. Please slow down and try again in ${result.resetInSeconds} seconds.`,
      retryAfterSeconds: result.resetInSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": result.resetInSeconds.toString(),
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.resetInSeconds.toString(),
      },
    }
  );
}
