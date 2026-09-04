import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { signToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/jwt";
import { Role } from "@/types/store";
import { getClientDeviceInfo } from "@/lib/auth/device";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/auth/rateLimit";

const ALLOWED_REGISTER_ROLES: Role[] = ["customer", "seller", "supplier"];

export async function POST(req: NextRequest) {
  try {
    // 0. Enforce Rate Limiting (5 registration attempts per 60 seconds per IP)
    const rateCheck = await checkRateLimit(req, {
      maxRequests: 5,
      windowSeconds: 60,
      action: "auth:register",
    });
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck);
    }

    const clientScan = getClientDeviceInfo(req);
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

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Privilege Escalation Prevention: Never allow 'admin' registration or reserved email
    if (normalizedEmail === "dks45000000@gmail.com") {
      return NextResponse.json(
        {
          success: false,
          error: "The primary Superadmin account is reserved and cannot be registered publicly.",
        },
        { status: 403 }
      );
    }

    if (role === "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Administrative accounts cannot be created via public registration.",
        },
        { status: 403 }
      );
    }

    if (role === "seller" || role === "supplier") {
      return NextResponse.json(
        {
          success: false,
          error: "Merchant accounts cannot be registered directly. Please submit a verified Merchant Application at /seller/apply.",
        },
        { status: 403 }
      );
    }

    // Public registration only ever creates customer accounts
    const safeRole: Role = "customer";

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
      merchantStatus: "none",
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
      lastLoginIp: clientScan.ip,
      deviceSessions: [
        {
          ip: clientScan.ip,
          userAgent: clientScan.userAgent,
          deviceInfo: clientScan.deviceInfo,
          lastActive: new Date(),
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
      deviceScan: clientScan,
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
