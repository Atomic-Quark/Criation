import { z } from "zod";

import {
  currencyCodeSchema,
  entityTimestampsSchema,
  idSchema,
  imageSchema,
  isoDateStringSchema,
  minorAmountSchema,
  paginationQuerySchema,
  slugSchema,
} from "./common";

export const productStatusSchema = z.enum(["draft", "active", "archived"]);

export const productVariantSchema = z.object({
  id: idSchema,
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Variant name is required"),
  price: minorAmountSchema,
  stock: z.number().int().nonnegative(),
});

export const categorySchema = entityTimestampsSchema.extend({
  name: z.string().min(1, "Category name is required"),
  slug: slugSchema,
  description: z.string().optional(),
  parentId: idSchema.nullable().optional(),
});

export const productSchema = entityTimestampsSchema.extend({
  name: z.string().min(1, "Product name is required").max(200),
  slug: slugSchema,
  description: z.string().max(5000),
  price: minorAmountSchema,
  currency: currencyCodeSchema,
  compareAtPrice: minorAmountSchema.nullable().optional(),
  status: productStatusSchema,
  categoryId: idSchema,
  tags: z.array(z.string().min(1)).max(20).default([]),
  images: z.array(imageSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  rating: z.number().min(0).max(5).nullable().optional(),
  reviewCount: z.number().int().nonnegative().default(0),
  publishedAt: isoDateStringSchema.nullable().optional(),
});

/** Payload accepted when creating a product: the server owns id/timestamps. */
export const createProductSchema = productSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .refine((product) => product.compareAtPrice == null || product.compareAtPrice > product.price, {
    message: "compareAtPrice must be greater than price",
    path: ["compareAtPrice"],
  });

export const updateProductSchema = productSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export const productFiltersSchema = paginationQuerySchema.extend({
  categoryId: idSchema.optional(),
  status: productStatusSchema.optional(),
  search: z.string().trim().max(200).optional(),
  minPrice: minorAmountSchema.optional(),
  maxPrice: minorAmountSchema.optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateProductInput = z.input<typeof createProductSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type ProductFiltersInput = z.input<typeof productFiltersSchema>;
