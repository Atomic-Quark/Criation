import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";
import { getJwtSecret } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { success: false, error: "Order ID is required to initiate payment intent." },
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
      return NextResponse.json(
        { success: false, error: "This order has already been paid." },
        { status: 400 }
      );
    }

    // 1. Generate Gateway Reference (e.g., Razorpay / Stripe / UPI Order Reference)
    const gatewayOrderId = `pay_intent_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    const secret = getJwtSecret();

    // 2. Generate HMAC SHA-256 Server Signature for payment integrity
    const payload = `${order.orderNumber}|${order.total}|${gatewayOrderId}`;
    const serverSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    return NextResponse.json({
      success: true,
      orderId: order.orderNumber,
      amount: order.total,
      currency: "INR",
      gatewayOrderId,
      serverSignature,
      keyId: "rzp_live_criation_merchant_key_2026",
    });
  } catch (error: any) {
    console.error("[Create Payment Intent Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment intent." },
      { status: 500 }
    );
  }
}
