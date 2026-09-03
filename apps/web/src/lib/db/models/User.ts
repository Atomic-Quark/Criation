import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { Role } from "@/types/store";

export interface IUserAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  avatar?: string;
  role: Role;
  merchantStatus?: "none" | "pending" | "verified" | "rejected";
  merchantApplicationId?: mongoose.Types.ObjectId;
  walletBalance: number;
  loyaltyPoints: number;
  tier: "Silver" | "Gold" | "Diamond VIP";
  addresses: IUserAddress[];
  twoFactorEnabled: boolean;
  isAdminVerified: boolean;
  notificationPreferences: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  cart?: any[];
  wishlist?: any[];
  lastLoginIp?: string;
  deviceSessions?: Array<{
    ip: string;
    userAgent: string;
    deviceInfo: string;
    lastActive: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeProfile(): Record<string, unknown>;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    id: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    type: { type: String, enum: ["home", "work", "other"], default: "home" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    avatar: { type: String, default: "/products/craft-item-01.jpeg" },
    role: { type: String, enum: ["customer", "seller", "supplier", "admin"], default: "customer", index: true },
    merchantStatus: { type: String, enum: ["none", "pending", "verified", "rejected"], default: "none", index: true },
    merchantApplicationId: { type: Schema.Types.ObjectId, ref: "MerchantApplication" },
    walletBalance: { type: Number, default: 100 }, // ₹100 Welcome Bonus
    loyaltyPoints: { type: Number, default: 250 },
    tier: { type: String, enum: ["Silver", "Gold", "Diamond VIP"], default: "Gold" },
    addresses: [AddressSchema],
    twoFactorEnabled: { type: Boolean, default: false },
    isAdminVerified: { type: Boolean, default: false },
    notificationPreferences: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    cart: { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
    lastLoginIp: { type: String, default: "127.0.0.1" },
    deviceSessions: {
      type: [
        {
          ip: { type: String, default: "127.0.0.1" },
          userAgent: { type: String, default: "Standard Browser" },
          deviceInfo: { type: String, default: "Windows PC" },
          lastActive: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to return public safe profile
UserSchema.methods.toSafeProfile = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    avatar: this.avatar,
    role: this.role,
    merchantStatus: this.merchantStatus || "none",
    merchantApplicationId: this.merchantApplicationId?.toString(),
    walletBalance: this.walletBalance,
    loyaltyPoints: this.loyaltyPoints,
    tier: this.tier,
    addresses: this.addresses || [],
    twoFactorEnabled: this.twoFactorEnabled,
    isAdminVerified: this.isAdminVerified,
    cart: this.cart || [],
    wishlist: this.wishlist || [],
    lastLoginIp: this.lastLoginIp || "127.0.0.1",
    deviceSessions: this.deviceSessions || [],
    joinedDate: this.createdAt ? new Date(this.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "August 2026",
    notificationPreferences: this.notificationPreferences,
  };
};

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as any).User;
}

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
