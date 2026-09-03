import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

// GET /api/cart - Fetch current authenticated user's isolated cart
export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: true, isGuest: true, cart: [] },
        { status: 200 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid session." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user._id.toString(),
      email: user.email,
      cart: user.cart || [],
    });
  } catch (error: any) {
    console.error("[API/cart] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart." },
      { status: 500 }
    );
  }
}

// POST /api/cart - Persist cart specifically for this authenticated account
export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Guest cart handled in guest local storage partition
      return NextResponse.json({ success: true, isGuest: true });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid session." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cart } = body;

    if (!Array.isArray(cart)) {
      return NextResponse.json(
        { success: false, error: "Cart must be an array of items." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    user.cart = cart;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cart saved specifically for account " + user.email,
      itemCount: cart.length,
    });
  } catch (error: any) {
    console.error("[API/cart] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save cart." },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart for this authenticated account
export async function DELETE(req: NextRequest) {
  try {
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ success: true, isGuest: true });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid session." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    await User.findByIdAndUpdate(payload.userId, { $set: { cart: [] } });

    return NextResponse.json({
      success: true,
      message: "Account cart cleared.",
    });
  } catch (error: any) {
    console.error("[API/cart] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cart." },
      { status: 500 }
    );
  }
}
