import { ProductStatus, type Category, type Product } from "@criation/types";

/**
 * In-memory seed catalogue. CT-003 only establishes the monorepo structure —
 * a real datastore replaces this module without changing the route handlers.
 */

const NOW = "2026-01-15T10:00:00.000Z";

export const categories: Category[] = [
  {
    id: "cat_apparel",
    name: "Apparel",
    slug: "apparel",
    description: "Everyday wear designed and made in-house.",
    parentId: null,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Finishing pieces for every outfit.",
    parentId: null,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

export const products: Product[] = [
  {
    id: "prd_linen_shirt",
    name: "Linen Shirt",
    slug: "linen-shirt",
    description: "Breathable European linen with a relaxed cut.",
    price: 249900,
    currency: "INR",
    compareAtPrice: 299900,
    status: ProductStatus.Active,
    categoryId: "cat_apparel",
    tags: ["linen", "summer"],
    images: [
      {
        url: "https://cdn.criation.example/products/linen-shirt.jpg",
        alt: "Folded linen shirt on a neutral background",
        width: 1200,
        height: 1600,
      },
    ],
    variants: [
      { id: "var_linen_s", sku: "LIN-SH-S", name: "Small", price: 249900, stock: 12 },
      { id: "var_linen_m", sku: "LIN-SH-M", name: "Medium", price: 249900, stock: 8 },
    ],
    rating: 4.6,
    reviewCount: 42,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prd_canvas_tote",
    name: "Canvas Tote",
    slug: "canvas-tote",
    description: "Heavyweight cotton canvas with reinforced handles.",
    price: 129900,
    currency: "INR",
    compareAtPrice: null,
    status: ProductStatus.Active,
    categoryId: "cat_accessories",
    tags: ["canvas", "everyday"],
    images: [
      {
        url: "https://cdn.criation.example/products/canvas-tote.jpg",
        alt: "Canvas tote bag standing upright",
        width: 1200,
        height: 1200,
      },
    ],
    variants: [{ id: "var_tote_one", sku: "CAN-TO-1", name: "One size", price: 129900, stock: 30 }],
    rating: 4.8,
    reviewCount: 118,
    publishedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prd_wool_scarf",
    name: "Wool Scarf",
    slug: "wool-scarf",
    description: "Merino wool scarf, woven in small batches.",
    price: 189900,
    currency: "INR",
    compareAtPrice: null,
    status: ProductStatus.Draft,
    categoryId: "cat_accessories",
    tags: ["wool", "winter"],
    images: [],
    variants: [],
    rating: null,
    reviewCount: 0,
    publishedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
  },
];
