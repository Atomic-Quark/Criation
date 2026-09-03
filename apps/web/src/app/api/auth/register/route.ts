import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { signToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/jwt";
import { Role } from "@/types/store";

const ALLOWED_REGISTER_ROLES: Role[] = ["customer", "seller", "supplier"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role = "customer" } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 2. Privilege Escalation Prevention: Never allow 'admin' registration
    if (role === "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Administrative accounts cannot be created via public registration.",
        },
        { status: 403 }
      );
    }

    const safeRole: Role = ALLOWED_REGISTER_ROLES.includes(role as Role)
      ? (role as Role)
      : "customer";

    const normalizedEmail = email.toLowerCase().trim();

    // 3. Database Operation (Strict - no offline auth bypass)
    try {
      await connectToDatabase();
    } catch (dbErr: any) {
      console.error("[Register API DB Connection Error]:", dbErr.message);
      return NextResponse.json(
        {
          success: false,
          error: "Authentication service is temporarily unavailable. Database connection failed.",
        },
        { status: 503 }
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in DB
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone ? String(phone).trim() : "+91 XXXXX XXXXX",
      role: safeRole,
      walletBalance: 100, // ₹100 Welcome bonus
      loyaltyPoints: 250,
      tier: "Gold",
      isAdminVerified: false,
      addresses: [
        {
          id: `addr_${Date.now()}`,
          fullName: name.trim(),
          phone: phone ? String(phone).trim() : "+91 XXXXX XXXXX",
          line1: "Primary Delivery Address",
          city: "Gurugram",
          state: "Haryana",
          pincode: "122002",
          country: "India",
          type: "home",
          isDefault: true,
        },
      ],
    });

    const userProfile = newUser.toSafeProfile();
    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Account registered successfully.",
      user: userProfile,
      token,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    console.error("[Register API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
