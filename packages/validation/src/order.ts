import { z } from "zod";

import {
  currencyCodeSchema,
  entityTimestampsSchema,
  idSchema,
  isoDateStringSchema,
  minorAmountSchema,
} from "./common";
import { addressSchema } from "./user";

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const orderItemSchema = z.object({
  productId: idSchema,
  variantId: idSchema.nullable().optional(),
  name: z.string().min(1),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  unitPrice: minorAmountSchema,
});

export const cartItemSchema = z.object({
  productId: idSchema,
  variantId: idSchema.nullable().optional(),
  quantity: z.number().int().positive().max(99),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  currency: currencyCodeSchema,
});

export const orderSchema = entityTimestampsSchema.extend({
  orderNumber: z.string().min(1),
  userId: idSchema,
  status: orderStatusSchema,
  items: z.array(orderItemSchema).min(1, "An order needs at least one item"),
  currency: currencyCodeSchema,
  subtotal: minorAmountSchema,
  shipping: minorAmountSchema,
  tax: minorAmountSchema,
  total: minorAmountSchema,
  shippingAddress: addressSchema,
  placedAt: isoDateStringSchema,
});

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, "An order needs at least one item"),
  shippingAddress: addressSchema,
});

export type CreateOrderInput = z.input<typeof createOrderSchema>;
