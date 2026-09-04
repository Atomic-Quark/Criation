import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";
import { validatePhoneNumber } from "@/lib/auth/phoneValidation";
import { validateEmail } from "@/lib/auth/emailValidation";

export async function PATCH(req: NextRequest) {
  try {
    // 1. Authenticate user from cookie or authorization header
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session. Please sign in again." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, dialCode = "+91", phone, email } = body;

    // 2. Validate Full Name
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid full name (at least 2 characters)." },
          { status: 400 }
        );
      }
      user.name = name.trim();
    }

    // 3. Validate Phone Number
    if (phone !== undefined && phone !== "") {
      const phoneValidation = validatePhoneNumber(dialCode, phone);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: phoneValidation.error || "Please enter a valid international phone number.",
          },
          { status: 400 }
        );
      }
      user.phone = phoneValidation.formattedE164;
      user.countryCode = dialCode;
    }

    // 4. Validate Email
    if (email !== undefined && email !== "") {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return NextResponse.json(
          { success: false, error: emailValidation.error || "Please enter a valid email address." },
          { status: 400 }
        );
      }

      // If email is changing, check uniqueness
      if (emailValidation.normalizedEmail !== user.email) {
        const existing = await User.findOne({
          email: emailValidation.normalizedEmail,
          _id: { $ne: user._id },
        });
        if (existing) {
          return NextResponse.json(
            { success: false, error: "This email address is already in use by another account." },
            { status: 409 }
          );
        }
        user.email = emailValidation.normalizedEmail;
        user.isEmailVerified = false; // reset verification flag on change
      }
    }

    // 5. Update twoFactorEnabled & tier preferences if specified
    if (body.twoFactorEnabled !== undefined) {
      user.twoFactorEnabled = Boolean(body.twoFactorEnabled);
    }
    if (body.tier !== undefined) {
      user.tier = body.tier;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: user.toSafeProfile(),
    });
  } catch (error: any) {
    console.error("[Profile Update Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
