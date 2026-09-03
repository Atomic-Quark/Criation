import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";
import { User } from "@/lib/db/models/User";
import { getJwtSecret, verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      gatewayOrderId,
      gatewayPaymentId,
      serverSignature,
      paymentMethod = "upi",
    } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const order = await Order.findOne({
      $or: [{ orderNumber: orderId }, { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null }],
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({
        success: true,
        message: "Order already verified and paid.",
        order,
      });
    }

    // 1. Payment Verification Flow by Method
    if (paymentMethod === "wallet") {
      // Atomic wallet balance deduction
      const token =
        req.cookies.get(AUTH_COOKIE_NAME)?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");
      const session = token ? verifyToken(token) : null;

      if (!session) {
        return NextResponse.json(
          { success: false, error: "Authentication required for wallet payment." },
          { status: 401 }
        );
      }

      // Check balance and atomically deduct
      const updatedUser = await User.findOneAndUpdate(
        { _id: session.userId, walletBalance: { $gte: order.total } },
        { $inc: { walletBalance: -order.total } },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: "Insufficient wallet balance to complete transaction." },
          { status: 400 }
        );
      }
    } else if (paymentMethod === "cod") {
      // Cash on delivery: keeps paymentStatus as pending until delivery
      order.paymentMethod = "cod";
      await order.save();
      return NextResponse.json({
        success: true,
        message: "Order placed via Cash on Delivery.",
        order,
      });
    } else {
      // Gateway Payment (UPI / Card / NetBanking / Razorpay)
      // Verify Cryptographic Signature
      if (!serverSignature || !gatewayOrderId) {
        return NextResponse.json(
          { success: false, error: "Invalid payment payload: missing gateway order ID or signature." },
          { status: 400 }
        );
      }

      const secret = getJwtSecret();
      const expectedPayload = `${order.orderNumber}|${order.total}|${gatewayOrderId}`;
      const expectedSignature = crypto.createHmac("sha256", secret).update(expectedPayload).digest("hex");

      if (serverSignature !== expectedSignature) {
        return NextResponse.json(
          { success: false, error: "Payment verification failed: cryptographic signature mismatch." },
          { status: 403 }
        );
      }
    }

    // 2. Transition Order to Paid in Database
    order.paymentStatus = "paid";
    order.status = "order_placed";
    order.paymentMethod = paymentMethod;
    if (gatewayPaymentId) {
      order.transactionId = String(gatewayPaymentId);
    }
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and captured.",
      order,
    });
  } catch (error: any) {
    console.error("[Verify Payment Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
