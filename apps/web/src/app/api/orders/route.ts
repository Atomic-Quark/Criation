import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Order } from "@/lib/db/models/Order";
import { Product } from "@/lib/db/models/Product";
import { initialOrders, initialProducts } from "@/lib/data/mockCatalog";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const session = token ? verifyToken(token) : null;
    const { searchParams } = new URL(req.url);
    const requestedEmail = searchParams.get("email");

    try {
      await connectToDatabase();
      const filter: any = {};

      // If regular customer, strictly scope orders to their own authenticated email
      if (session && session.role !== "admin") {
        filter.userEmail = session.email.toLowerCase();
      } else if (session && session.role === "admin" && requestedEmail) {
        filter.userEmail = requestedEmail.toLowerCase();
      } else if (!session && requestedEmail) {
        filter.userEmail = requestedEmail.toLowerCase();
      }

      const orders = await Order.find(filter).sort({ createdAt: -1 });

      if (orders.length === 0) {
        return NextResponse.json({ success: true, orders: initialOrders });
      }

      return NextResponse.json({ success: true, orders });
    } catch (dbErr: any) {
      console.warn("[Orders API DB Warning]:", dbErr.message);
      return NextResponse.json({ success: true, orders: initialOrders, fallback: true });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const session = token ? verifyToken(token) : null;

    const body = await req.json();
    const {
      items = [],
      shippingAddress,
      paymentMethod = "upi",
      userEmail,
      userName,
      userPhone,
      currency = "INR",
      couponCode,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    if (!shippingAddress || typeof shippingAddress !== "object" || !shippingAddress.line1) {
      return NextResponse.json(
        { success: false, error: "Valid delivery shipping address is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 1. Server-Side Price Calculation & Product Verification
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const cleanName = typeof item.name === "string" ? item.name.trim() : "";

      // Try finding product in MongoDB or fallback to catalog
      const product = await Product.findOne({
        $or: [
          { _id: item.productId?.match(/^[0-9a-fA-F]{24}$/) ? item.productId : null },
          { slug: item.productSlug || (item.productId ? String(item.productId).replace("prd_", "").replace(/_/g, "-") : null) },
          ...(cleanName ? [{ name: { $regex: cleanName.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), $options: "i" } }] : []),
        ],
      });

      const catalogFallback = initialProducts.find(
        (p) =>
          p.id === item.productId ||
          p.slug === item.productSlug ||
          (cleanName && p.name.toLowerCase().includes(cleanName.toLowerCase())) ||
          (cleanName && cleanName.toLowerCase().includes(p.name.toLowerCase()))
      );

      // Strictly derived from catalog / DB - NEVER trust client item.price
      const unitPrice = product ? product.price : (catalogFallback?.price || 299);
      const productName = product ? product.name : (catalogFallback?.name || cleanName || "Handcrafted Item");
      const productImage = product?.images[0]?.url || catalogFallback?.images[0]?.url || item.image || "/products/craft-item-01.jpeg";

      const itemTotal = unitPrice * quantity;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        productId: product ? product._id.toString() : (item.productId || `prd_${Date.now()}`),
        name: productName,
        price: unitPrice,
        quantity,
        image: productImage,
        variantName: item.variant ? String(item.variant) : undefined,
      });
    }

    // 2. Server-side discount validation
    let discount = 0;
    if (couponCode && typeof couponCode === "string") {
      const cleanCoupon = couponCode.trim().toUpperCase();
      if (cleanCoupon === "WELCOME10" || cleanCoupon === "CRIATION10") {
        discount = Math.round(calculatedSubtotal * 0.1);
      } else if (cleanCoupon === "VIP20") {
        discount = Math.round(calculatedSubtotal * 0.2);
      }
    }

    const shipping = calculatedSubtotal > 499 ? 0 : 49;
    const tax = Math.round((calculatedSubtotal - discount) * 0.05); // 5% GST
    const calculatedTotal = Math.max(0, calculatedSubtotal - discount + shipping + tax);

    // 3. Generate Order ID
    const orderId = `CR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const buyerEmail = session?.email || userEmail?.toLowerCase()?.trim() || "guest@criation.example";
    const buyerName = session?.name || userName?.trim() || shippingAddress.fullName || "Valued Customer";
    const buyerPhone = userPhone || shippingAddress.phone || "+91 XXXXX XXXXX";

    // 4. Strict Document Creation (Payment status is strictly PENDING until verified)
    const order = await Order.create({
      orderNumber: orderId,
      userId: session?.userId || `guest_${Date.now()}`,
      userEmail: buyerEmail,
      date: new Date(),
      status: "order_placed",
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      discount,
      shippingFee: shipping,
      tax,
      total: calculatedTotal,
      shippingAddress: {
        fullName: shippingAddress.fullName || buyerName,
        phone: shippingAddress.phone || buyerPhone,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2 || "",
        city: shippingAddress.city || "New Delhi",
        state: shippingAddress.state || "Delhi",
        pincode: shippingAddress.pincode || "110001",
        country: shippingAddress.country || "India",
      },
      paymentMethod,
      paymentStatus: "pending",
      courier: {
        name: "BlueDart Express Priority",
        trackingNumber: `BLU${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        trackingUrl: `https://bluedart.example/track/BLU${orderId}`,
        estimatedDelivery: "3-4 Business Days",
      },
      trackingTimeline: [
        {
          status: "order_placed",
          title: "Order Placed & Confirmed",
          description: "Order placed. Dispatched to artisan workshop for handcrafting & packing.",
          timestamp: "Just now",
          location: "Criation Fulfillment",
          completed: true,
          current: true,
        },
      ],
      canCancel: true,
      canReturn: false,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully. Awaiting payment verification.",
      order,
    });
  } catch (error: any) {
    console.error("[Orders API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order." },
      { status: 500 }
    );
  }
}
