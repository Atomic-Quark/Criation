import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/auth/rateLimit";
import { verifyOtp } from "@/lib/auth/otpService";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 OTP verify attempts per 60 seconds per IP
    const rateCheck = await checkRateLimit(req, {
      maxRequests: 10,
      windowSeconds: 60,
      action: "auth:otp:verify",
    });
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck);
    }

    const body = await req.json();
    const { target, code } = body;

    if (!target || !code) {
      return NextResponse.json(
        { success: false, error: "Target identifier and 6-digit verification code are required." },
        { status: 400 }
      );
    }

    const result = verifyOtp(target, code);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      verificationToken: result.verificationToken,
    });
  } catch (error: any) {
    console.error("[OTP Verify Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify authentication code." },
      { status: 500 }
    );
  }
}
