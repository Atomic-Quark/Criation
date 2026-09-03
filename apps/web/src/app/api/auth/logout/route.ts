import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/jwt";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  // Expire auth cookie
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  return response;
}
