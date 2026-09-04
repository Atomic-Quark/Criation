import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, AUTH_COOKIE_NAME, JWTPayload } from "@/lib/auth/jwt";

export const SUPERADMIN_EMAIL = "dks45000000@gmail.com";

export interface RequireRoleSuccess {
  ok: true;
  user: JWTPayload;
}

export interface RequireRoleFailure {
  ok: false;
  response: NextResponse;
}

export type RequireRoleResult = RequireRoleSuccess | RequireRoleFailure;

/**
 * Defense-in-depth authorization helper.
 * Re-verifies cryptographic JWT signature independently inside sensitive route handlers,
 * instead of trusting middleware-injected headers alone.
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[],
  options?: { requireSuperadmin?: boolean }
): Promise<RequireRoleResult> {
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ??
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized: Authentication token required" },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyJwt(token);
  if (!payload || !allowedRoles.includes(payload.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden: Insufficient privileges" },
        { status: 403 }
      ),
    };
  }

  if (options?.requireSuperadmin) {
    if (payload.email?.toLowerCase().trim() !== SUPERADMIN_EMAIL) {
      return {
        ok: false,
        response: NextResponse.json(
          { success: false, error: "Forbidden: Superadmin access strictly restricted" },
          { status: 403 }
        ),
      };
    }
  }

  return { ok: true, user: payload };
}
