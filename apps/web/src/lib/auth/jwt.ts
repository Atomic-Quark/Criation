import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { Role } from "@/types/store";

/**
 * Validates and retrieves the JWT secret.
 * Throws a fatal exception in production if missing or insecure.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[SECURITY FATAL] JWT_SECRET environment variable is missing in production! System halting."
      );
    }
    // Safe non-production development fallback
    return "criation_dev_local_only_insecure_secret_key_change_me_in_prod";
  }

  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error(
      "[SECURITY FATAL] JWT_SECRET must be at least 32 characters in production."
    );
  }

  return secret;
}

const JWT_EXPIRES_IN = "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

/**
 * Sign a token using standard jsonwebtoken for Node.js API handlers.
 */
export function signToken(payload: JWTPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN, algorithm: "HS256" });
}

/**
 * Synchronous token verification for Node API routes.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret, { algorithms: ["HS256"] }) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Async WebCrypto/Edge-compatible token verification for Next.js Middleware.
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJwtSecret();
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return {
      userId: (payload.userId as string) || (payload.sub as string) || "",
      email: (payload.email as string) || "",
      role: (payload.role as Role) || "customer",
      name: (payload.name as string) || "",
    };
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = "criation_auth_token";

/**
 * Direct alias for verifyTokenEdge as standard verifyJwt
 */
export const verifyJwt = verifyTokenEdge;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
