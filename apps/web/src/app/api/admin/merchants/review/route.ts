import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { MerchantApplication } from "@/lib/db/models/MerchantApplication";
import { verifyTokenEdge, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

const SUPERADMIN_EMAIL = "dks45000000@gmail.com";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { applicationId, action, notes } = body;

    if (!applicationId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Application ID and valid action (approve/reject) are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const application = await MerchantApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { success: false, error: "Merchant application not found." },
        { status: 404 }
      );
    }

    const applicantUser = await User.findById(application.userId);
    if (!applicantUser) {
      return NextResponse.json(
        { success: false, error: "Applicant user profile not found." },
        { status: 404 }
      );
    }

    if (action === "approve") {
      // 1. Mark application approved
      application.status = "approved";
      application.adminNotes = notes || "Approved by Superadmin after government statutory verification.";
      application.reviewedBy = SUPERADMIN_EMAIL;
      application.reviewedAt = new Date();
      await application.save();

      // 2. Grant merchant role to user
      applicantUser.role = "seller";
      applicantUser.merchantStatus = "verified";
      await applicantUser.save();

      return NextResponse.json({
        success: true,
        message: `Merchant application for ${application.businessName} approved successfully. User role updated to seller.`,
        application: {
          id: application._id.toString(),
          status: "approved",
          businessName: application.businessName,
        },
      });
    } else {
      // Action === "reject"
      application.status = "rejected";
      application.adminNotes = notes || "Application does not satisfy statutory validation requirements.";
      application.reviewedBy = SUPERADMIN_EMAIL;
      application.reviewedAt = new Date();
      await application.save();

      applicantUser.merchantStatus = "rejected";
      await applicantUser.save();

      return NextResponse.json({
        success: true,
        message: `Merchant application for ${application.businessName} has been rejected.`,
        application: {
          id: application._id.toString(),
          status: "rejected",
          adminNotes: application.adminNotes,
        },
      });
    }
  } catch (error: any) {
    console.error("[Admin Review API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process application review." },
      { status: 500 }
    );
  }
}
