export type EntityType =
  | "proprietorship"
  | "partnership"
  | "pvt_ltd"
  | "artisan_cooperative"
  | "individual_craftsman";

export interface SellerApplicationData {
  id?: string;
  businessName: string;
  tradeName: string;
  entityType: EntityType;
  category: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  pan: string;
  isGstExempt: boolean;
  gstin?: string;
  artisanCardNumber?: string;
  bankDetails: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
    accountHolderName: string;
  };
  documents: {
    panCardUrl?: string;
    gstCertificateUrl?: string;
    bankProofUrl?: string;
    artisanProofUrl?: string;
  };
  status?: "pending_review" | "approved" | "rejected";
  adminNotes?: string;
  createdAt?: string;
}
