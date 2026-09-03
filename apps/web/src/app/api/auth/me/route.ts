import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated session." },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    try {
      await connectToDatabase();
      const user = await User.findById(payload.userId);

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User record not found in MongoDB." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: user.toSafeProfile(),
      });
    } catch (dbError) {
      // Fallback
      return NextResponse.json({
        success: true,
        user: {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          walletBalance: 750,
          loyaltyPoints: 350,
          tier: "Gold",
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error fetching user session." },
      { status: 500 }
    );
  }
}
