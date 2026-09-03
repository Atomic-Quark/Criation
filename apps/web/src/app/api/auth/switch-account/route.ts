import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { signToken, AUTH_COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/jwt";
import { getClientDeviceInfo } from "@/lib/auth/device";

export async function POST(req: NextRequest) {
  try {
    const clientScan = getClientDeviceInfo(req);
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Target email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found on this device." },
        { status: 404 }
      );
    }

    // Record session switch
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

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: `Switched account to ${user.name}.`,
      user: user.toSafeProfile(),
      token,
      deviceScan: clientScan,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    console.error("[Switch Account Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to switch account on this device." },
      { status: 500 }
    );
  }
}
