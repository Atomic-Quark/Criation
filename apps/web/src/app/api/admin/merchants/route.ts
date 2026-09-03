import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { MerchantApplication } from "@/lib/db/models/MerchantApplication";
import { verifyTokenEdge, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const SUPERADMIN_EMAIL = "dks45000000@gmail.com";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Superadmin Authorization
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const session = await verifyTokenEdge(token);
    if (
      !session ||
      session.role !== "admin" ||
      session.email?.toLowerCase().trim() !== SUPERADMIN_EMAIL
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Superadmin access strictly restricted." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, any> = {};
    if (status && ["pending_review", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const applications = await MerchantApplication.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications: applications.map((app: any) => ({
        id: app._id.toString(),
        userId: app.userId?.toString(),
        applicantName: app.applicantName,
        applicantEmail: app.applicantEmail,
        businessName: app.businessName,
        tradeName: app.tradeName,
        entityType: app.entityType,
        category: app.category,
        phone: app.phone,
        businessAddress: app.businessAddress,
        gstin: app.gstin,
        isGstExempt: app.isGstExempt,
        pan: app.pan,
        artisanCardNumber: app.artisanCardNumber,
        bankDetails: app.bankDetails,
        documents: app.documents,
        govVerification: app.govVerification,
        status: app.status,
        adminNotes: app.adminNotes,
        createdAt: app.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("[Admin Merchants API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch merchant applications." },
      { status: 500 }
    );
  }
}
