import type { Entity, IsoDateString } from "./common";
import type { Address } from "./user";

export const OrderStatus = {
  Pending: "pending",
  Paid: "paid",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Refunded: "refunded",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  productId: string;
  variantId?: string | null;
  name: string;
  quantity: number;
  /** Unit price in the smallest currency unit, captured at order time. */
  unitPrice: number;
}

export interface Order extends Entity {
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  currency: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  placedAt: IsoDateString;
}

export interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  currency: string;
}
