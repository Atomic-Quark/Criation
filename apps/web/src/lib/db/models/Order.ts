import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
  supplierName?: string;
}

export interface ITrackingStep {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  userId?: string;
  userEmail: string;
  date: Date;
  status: "order_placed" | "packed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "returned";
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: "upi" | "card" | "wallet" | "cod" | "netbanking";
  paymentStatus: "paid" | "pending" | "refunded" | "failed";
  transactionId?: string;
  courier: {
    name: string;
    trackingNumber: string;
    trackingUrl: string;
    estimatedDelivery: string;
  };
  trackingTimeline: ITrackingStep[];
  canCancel: boolean;
  canReturn: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    userEmail: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["order_placed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"],
      default: "order_placed",
      index: true,
    },
    items: [
      {
        id: { type: String, required: true },
        productId: { type: String, required: true },
        variantId: { type: String },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        variantName: { type: String },
        supplierName: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "wallet", "cod", "netbanking"],
      default: "upi",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "refunded", "failed"],
      default: "paid",
    },
    transactionId: { type: String },
    courier: {
      name: { type: String, default: "BlueDart Express Priority" },
      trackingNumber: { type: String, default: () => `BLU${Math.floor(10000000 + Math.random() * 90000000)}IN` },
      trackingUrl: { type: String, default: "https://bluedart.example" },
      estimatedDelivery: { type: String, default: "3-4 Business Days" },
    },
    trackingTimeline: [
      {
        status: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        timestamp: { type: String, required: true },
        location: { type: String, required: true },
        completed: { type: Boolean, default: false },
        current: { type: Boolean, default: false },
      },
    ],
    canCancel: { type: Boolean, default: true },
    canReturn: { type: Boolean, default: false },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;
