import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { MerchantApplication } from "@/lib/db/models/MerchantApplication";
import { requireRole } from "@/lib/auth/requireRole";

export async function GET(req: NextRequest) {
  try {
    // 1. Defense-in-Depth Superadmin Authorization
    const auth = await requireRole(req, ["admin"], { requireSuperadmin: true });
    if (!auth.ok) return auth.response;

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
