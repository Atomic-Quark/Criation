import type { Entity, Image, IsoDateString } from "./common";

export const ProductStatus = {
  Draft: "draft",
  Active: "active",
  Archived: "archived",
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export interface Category extends Entity {
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  /** Price in the smallest currency unit. */
  price: number;
  stock: number;
}

export interface Product extends Entity {
  name: string;
  slug: string;
  description: string;
  /** Price in the smallest currency unit, e.g. 129900 for ₹1,299.00. */
  price: number;
  /** ISO 4217 currency code for `price` and every variant price. */
  currency: string;
  /** Original price before discount, when the product is on sale. */
  compareAtPrice?: number | null;
  status: ProductStatus;
  categoryId: string;
  tags: string[];
  images: Image[];
  variants: ProductVariant[];
  /** Aggregate rating from 0 to 5, or null when unrated. */
  rating?: number | null;
  reviewCount: number;
  publishedAt?: IsoDateString | null;
}

/** Trimmed product shape used in listings and search results. */
export type ProductSummary = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "currency" | "status" | "rating"
> & {
  thumbnail?: Image;
};

export interface ProductFilters {
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}
