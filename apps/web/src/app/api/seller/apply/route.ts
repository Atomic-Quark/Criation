import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/User";
import { MerchantApplication } from "@/lib/db/models/MerchantApplication";
import { verifyTokenEdge, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

// Statutory Indian Validation Regex Patterns
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const VALID_STATE_CODES = new Set([
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31", "32", "33", "34", "35", "36", "37", "38", "97", "99",
]);

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Request
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required to apply for a merchant account." },
        { status: 401 }
      );
    }

    const session = await verifyTokenEdge(token);
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session. Please sign in again." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      businessName,
      tradeName,
      entityType,
      category,
      phone,
      businessAddress,
      gstin,
      isGstExempt,
      pan,
      artisanCardNumber,
      bankDetails,
      documents,
    } = body;

    // 2. Input Validation
    if (!businessName || !tradeName || !entityType || !category || !phone) {
      return NextResponse.json(
        { success: false, error: "Please complete all required business identity fields." },
        { status: 400 }
      );
    }

    if (!businessAddress || !businessAddress.line1 || !businessAddress.city || !businessAddress.state || !businessAddress.pincode) {
      return NextResponse.json(
        { success: false, error: "Please provide complete registered business address details." },
        { status: 400 }
      );
    }

    // PAN Validation
    const cleanPan = String(pan || "").trim().toUpperCase();
    if (!PAN_REGEX.test(cleanPan)) {
      return NextResponse.json(
        { success: false, error: "Invalid Permanent Account Number (PAN). Format: ABCDE1234F (10 uppercase characters)." },
        { status: 400 }
      );
    }

    // GSTIN Validation (unless artisan turnover exempt)
    const cleanGstin = String(gstin || "").trim().toUpperCase();
    if (!isGstExempt) {
      if (!cleanGstin || !GSTIN_REGEX.test(cleanGstin)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid 15-character GSTIN. If your cooperative is turnover exempt under government rules, please toggle the exemption.",
          },
          { status: 400 }
        );
      }

      const stateCode = cleanGstin.substring(0, 2);
      if (!VALID_STATE_CODES.has(stateCode)) {
        return NextResponse.json(
          { success: false, error: `Invalid GSTIN state code (${stateCode}). Must match an official Indian state or UT.` },
          { status: 400 }
        );
      }

      // Verify that PAN is embedded inside GSTIN (characters 3-12)
      const panInGstin = cleanGstin.substring(2, 12);
      if (panInGstin !== cleanPan) {
        return NextResponse.json(
          { success: false, error: `PAN mismatch: The PAN inside your GSTIN (${panInGstin}) does not match the provided PAN (${cleanPan}).` },
          { status: 400 }
        );
      }
    } else if (!artisanCardNumber) {
      return NextResponse.json(
        { success: false, error: "For GST-exempt artisans, please provide your Pehchan Artisan Card or Udyam Registration Number." },
        { status: 400 }
      );
    }

    // Bank Details Validation
    if (!bankDetails || !bankDetails.accountNumber || !bankDetails.ifsc || !bankDetails.accountHolderName) {
      return NextResponse.json(
        { success: false, error: "Please provide complete payout bank account details." },
        { status: 400 }
      );
    }

    const cleanIfsc = String(bankDetails.ifsc || "").trim().toUpperCase();
    if (!IFSC_REGEX.test(cleanIfsc)) {
      return NextResponse.json(
        { success: false, error: "Invalid 11-character Bank IFSC code (e.g. SBIN0001234)." },
        { status: 400 }
      );
    }

    // Document Uploads Validation
    if (!documents || !documents.panCardUrl || !documents.bankProofUrl) {
      return NextResponse.json(
        { success: false, error: "Please upload your PAN card and bank account proof (cancelled cheque or passbook)." },
        { status: 400 }
      );
    }

    // 3. Automated Government Registry Check Simulation
    // In production, this integrates with sandbox GSTN API & NSDL PAN API
    const govVerification = {
      gstinStatus: (isGstExempt ? "exempt" : "active") as "active" | "exempt" | "invalid",
      gstinLegalName: isGstExempt ? tradeName : businessName,
      panStatus: "verified" as "verified" | "unverified",
      panHolderName: bankDetails.accountHolderName,
      bankIfscValid: true,
      bankName: bankDetails.bankName || "Verified Indian Scheduled Bank",
      confidenceScore: isGstExempt ? 92 : 98,
      verifiedAt: new Date(),
    };

    // 4. Upsert Merchant Application in MongoDB
    let application = await MerchantApplication.findOne({ userId: user._id });

    if (application) {
      application.applicantName = user.name;
      application.applicantEmail = user.email;
      application.businessName = businessName.trim();
      application.tradeName = tradeName.trim();
      application.entityType = entityType;
      application.category = category.trim();
      application.phone = phone.trim();
      application.businessAddress = businessAddress;
      application.gstin = isGstExempt ? undefined : cleanGstin;
      application.isGstExempt = Boolean(isGstExempt);
      application.pan = cleanPan;
      application.artisanCardNumber = artisanCardNumber?.trim();
      application.bankDetails = {
        accountNumber: String(bankDetails.accountNumber).trim(),
        ifsc: cleanIfsc,
        bankName: bankDetails.bankName?.trim() || "Nationalized Bank",
        accountHolderName: bankDetails.accountHolderName.trim(),
      };
      application.documents = documents;
      application.govVerification = govVerification;
      application.status = "pending_review";
      application.adminNotes = undefined;
      await application.save();
    } else {
      application = await MerchantApplication.create({
        userId: user._id,
        applicantName: user.name,
        applicantEmail: user.email,
        businessName: businessName.trim(),
        tradeName: tradeName.trim(),
        entityType,
        category: category.trim(),
        phone: phone.trim(),
        businessAddress,
        gstin: isGstExempt ? undefined : cleanGstin,
        isGstExempt: Boolean(isGstExempt),
        pan: cleanPan,
        artisanCardNumber: artisanCardNumber?.trim(),
        bankDetails: {
          accountNumber: String(bankDetails.accountNumber).trim(),
          ifsc: cleanIfsc,
          bankName: bankDetails.bankName?.trim() || "Nationalized Bank",
          accountHolderName: bankDetails.accountHolderName.trim(),
        },
        documents,
        govVerification,
        status: "pending_review",
      });
    }

    // 5. Update User Profile Status
    user.merchantStatus = "pending";
    user.merchantApplicationId = application._id as any;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Merchant onboarding application submitted successfully. Pending Superadmin verification.",
      application: {
        id: application._id.toString(),
        status: application.status,
        businessName: application.businessName,
        govVerification: application.govVerification,
        submittedAt: application.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[Merchant Apply API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process merchant application." },
      { status: 500 }
    );
  }
}
