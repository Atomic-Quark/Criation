import mongoose, { Schema, Document, Model } from "mongoose";

export type EntityType =
  | "proprietorship"
  | "partnership"
  | "pvt_ltd"
  | "artisan_cooperative"
  | "individual_craftsman";

export type ApplicationStatus = "pending_review" | "approved" | "rejected";

export interface IMerchantApplicationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  applicantEmail: string;
  applicantName: string;
  businessName: string;
  tradeName: string;
  entityType: EntityType;
  category: string;
  phone: string;
  businessAddress: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  gstin?: string;
  isGstExempt: boolean;
  pan: string;
  artisanCardNumber?: string;
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    accountHolderName: string;
  };
  documents: {
    gstCertificateUrl?: string;
    panCardUrl: string;
    bankProofUrl: string;
    artisanProofUrl?: string;
  };
  govVerification: {
    gstinStatus: "active" | "exempt" | "invalid";
    gstinLegalName?: string;
    panStatus: "verified" | "unverified";
    panHolderName?: string;
    bankIfscValid: boolean;
    bankName?: string;
    confidenceScore: number;
    verifiedAt: Date;
  };
  status: ApplicationStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MerchantApplicationSchema = new Schema<IMerchantApplicationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    applicantEmail: { type: String, required: true, lowercase: true, trim: true },
    applicantName: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    tradeName: { type: String, required: true, trim: true },
    entityType: {
      type: String,
      enum: ["proprietorship", "partnership", "pvt_ltd", "artisan_cooperative", "individual_craftsman"],
      default: "individual_craftsman",
    },
    category: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    businessAddress: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    gstin: { type: String, trim: true, uppercase: true },
    isGstExempt: { type: Boolean, default: false },
    pan: { type: String, required: true, trim: true, uppercase: true },
    artisanCardNumber: { type: String, trim: true },
    bankDetails: {
      accountNumber: { type: String, required: true, trim: true },
      ifsc: { type: String, required: true, trim: true, uppercase: true },
      bankName: { type: String, required: true, trim: true },
      accountHolderName: { type: String, required: true, trim: true },
    },
    documents: {
      gstCertificateUrl: { type: String },
      panCardUrl: { type: String, required: true },
      bankProofUrl: { type: String, required: true },
      artisanProofUrl: { type: String },
    },
    govVerification: {
      gstinStatus: { type: String, enum: ["active", "exempt", "invalid"], default: "active" },
      gstinLegalName: { type: String },
      panStatus: { type: String, enum: ["verified", "unverified"], default: "verified" },
      panHolderName: { type: String },
      bankIfscValid: { type: Boolean, default: true },
      bankName: { type: String },
      confidenceScore: { type: Number, default: 95 },
      verifiedAt: { type: Date, default: Date.now },
    },
    status: {
      type: String,
      enum: ["pending_review", "approved", "rejected"],
      default: "pending_review",
      index: true,
    },
    adminNotes: { type: String },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const MerchantApplication: Model<IMerchantApplicationDocument> =
  mongoose.models.MerchantApplication ||
  mongoose.model<IMerchantApplicationDocument>("MerchantApplication", MerchantApplicationSchema);
