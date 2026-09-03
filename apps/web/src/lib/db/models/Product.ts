import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductDocument extends Document {
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  detailedDescription?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  categoryId: string;
  categoryName: string;
  collectionSlug?: string;
  tags: string[];
  badge?: string;
  images: Array<{ url: string; alt: string; isCover?: boolean }>;
  variants: Array<{ id: string; sku: string; name: string; color?: string; size?: string; price: number; compareAtPrice?: number; stock: number }>;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  artisanName?: string;
  artisanLocation?: string;
  artisanStory?: string;
  isHandcrafted: boolean;
  isDropship: boolean;
  isWinningProduct?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  stock: number;
  supplierId?: string;
  supplierName?: string;
  supplierCost?: number;
  profitMarginPercent?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    tagline: { type: String },
    description: { type: String, required: true },
    detailedDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: "INR" },
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    collectionSlug: { type: String },
    tags: [{ type: String, index: true }],
    badge: { type: String },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isCover: { type: Boolean, default: false },
      },
    ],
    variants: [
      {
        id: { type: String, required: true },
        sku: { type: String, required: true },
        name: { type: String, required: true },
        color: { type: String },
        size: { type: String },
        price: { type: Number, required: true },
        compareAtPrice: { type: Number },
        stock: { type: Number, default: 10 },
      },
    ],
    rating: { type: Number, default: 4.9, min: 1, max: 5 },
    reviewCount: { type: Number, default: 12 },
    specifications: { type: Map, of: String },
    artisanName: { type: String },
    artisanLocation: { type: String },
    artisanStory: { type: String },
    isHandcrafted: { type: Boolean, default: true, index: true },
    isDropship: { type: Boolean, default: false, index: true },
    isWinningProduct: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    flashSaleEndsAt: { type: String },
    stock: { type: Number, default: 50 },
    supplierId: { type: String },
    supplierName: { type: String },
    supplierCost: { type: Number },
    profitMarginPercent: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;
