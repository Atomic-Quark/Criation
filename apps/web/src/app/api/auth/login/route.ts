import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { signToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Input Validation
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Email address and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Database Connection (Strict - no offline auth bypass)
    try {
      await connectToDatabase();
    } catch (dbErr: any) {
      console.error("[Login API DB Error]:", dbErr.message);
      return NextResponse.json(
        {
          success: false,
          error: "Authentication service is temporarily unavailable. Database connection failed.",
        },
        { status: 503 }
      );
    }

    // 3. User Lookup
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // 4. Password Verification
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // 5. Token Generation (Role strictly derived from database)
    const userProfile = user.toSafeProfile();
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully.",
      user: userProfile,
      token,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    console.error("[Login API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
