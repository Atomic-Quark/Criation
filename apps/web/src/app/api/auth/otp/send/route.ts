import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/auth/rateLimit";
import { validatePhoneNumber } from "@/lib/auth/phoneValidation";
import { validateEmail } from "@/lib/auth/emailValidation";
import { issueOtp } from "@/lib/auth/otpService";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 6 OTP requests per 60 seconds per IP
    const rateCheck = await checkRateLimit(req, {
      maxRequests: 6,
      windowSeconds: 60,
      action: "auth:otp:send",
    });
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck);
    }

    const body = await req.json();
    const { type, dialCode = "+91", value } = body;

    if (!type || (type !== "phone" && type !== "email") || !value) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid verification type ('phone' or 'email') and target value." },
        { status: 400 }
      );
    }

    let targetToVerify = "";

    if (type === "phone") {
      const phoneCheck = validatePhoneNumber(dialCode, value);
      if (!phoneCheck.isValid) {
        return NextResponse.json(
          { success: false, error: phoneCheck.error || "Invalid phone number format." },
          { status: 400 }
        );
      }
      targetToVerify = phoneCheck.formattedE164;
    } else {
      const emailCheck = validateEmail(value);
      if (!emailCheck.isValid) {
        return NextResponse.json(
          { success: false, error: emailCheck.error || "Invalid email format." },
          { status: 400 }
        );
      }
      targetToVerify = emailCheck.normalizedEmail;
    }

    const result = issueOtp(targetToVerify, type);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message, cooldownRemaining: result.cooldownRemaining },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      target: targetToVerify,
      devCode: result.devCode, // available in local environment for easy verification
    });
  } catch (error: any) {
    console.error("[OTP Send Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch verification code." },
      { status: 500 }
    );
  }
}
