import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { signToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/jwt";
import { getClientDeviceInfo } from "@/lib/auth/device";

export const SUPERADMIN_EMAIL = "dks45000000@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const clientScan = getClientDeviceInfo(req);
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

    // 3. User Lookup & Single-Admin Provisioning
    let user = await User.findOne({ email: normalizedEmail });

    // Auto-bootstrap primary Superadmin if logging in with dks45000000@gmail.com
    if (normalizedEmail === SUPERADMIN_EMAIL) {
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("123asd", salt);
        user = await User.create({
          name: "Divyanshu (Superadmin)",
          email: SUPERADMIN_EMAIL,
          passwordHash,
          phone: "+91 9420689638",
          role: "admin",
          walletBalance: 10000,
          loyaltyPoints: 1000,
          tier: "Diamond VIP",
          isAdminVerified: true,
        });
      } else if (user.role !== "admin" || !user.isAdminVerified) {
        user.role = "admin";
        user.isAdminVerified = true;
        await user.save();
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // 4. Password Verification
    let isMatch = await user.comparePassword(password);

    // If superadmin logging in with password "123asd" but hash differs, sync hash
    if (!isMatch && normalizedEmail === SUPERADMIN_EMAIL && password === "123asd") {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash("123asd", salt);
      await user.save();
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // SECURITY ENFORCEMENT: Under NO circumstances can any user other than dks45000000@gmail.com hold role: 'admin'
    if (user.role === "admin" && user.email !== SUPERADMIN_EMAIL) {
      user.role = "customer";
      user.isAdminVerified = false;
      await user.save();
    }

    // 5. Record Client Device & IP Session
    user.lastLoginIp = clientScan.ip;
    const existingSessions = user.deviceSessions || [];
    user.deviceSessions = [
      {
        ip: clientScan.ip,
        userAgent: clientScan.userAgent,
        deviceInfo: clientScan.deviceInfo,
        lastActive: new Date(),
      },
      ...existingSessions.filter((s: any) => s.ip !== clientScan.ip).slice(0, 9),
    ];
    await user.save();

    // 6. Token Generation (Role strictly derived from database)
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
      deviceScan: clientScan,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    console.error("[Login API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
