import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { MerchantApplication } from "@/lib/db/models/MerchantApplication";
import { verifyTokenEdge, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
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
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const application = await MerchantApplication.findOne({ userId: session.userId });

    if (!application) {
      return NextResponse.json({
        success: true,
        hasApplication: false,
        status: "none",
      });
    }

    return NextResponse.json({
      success: true,
      hasApplication: true,
      status: application.status,
      application: {
        id: application._id.toString(),
        businessName: application.businessName,
        tradeName: application.tradeName,
        entityType: application.entityType,
        category: application.category,
        phone: application.phone,
        gstin: application.gstin,
        isGstExempt: application.isGstExempt,
        pan: application.pan,
        artisanCardNumber: application.artisanCardNumber,
        bankDetails: {
          accountNumberMasked: `•••• •••• ${application.bankDetails.accountNumber.slice(-4)}`,
          ifsc: application.bankDetails.ifsc,
          bankName: application.bankDetails.bankName,
          accountHolderName: application.bankDetails.accountHolderName,
        },
        documents: application.documents,
        govVerification: application.govVerification,
        adminNotes: application.adminNotes,
        status: application.status,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("[Merchant Status API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch merchant application status." },
      { status: 500 }
    );
  }
}
