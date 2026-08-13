import { PAGINATION } from "@criation/config";
import type { Product, ProductSummary } from "@criation/types";
import { isDefined } from "@criation/utils";
import {
  createProductSchema,
  productFiltersSchema,
  type ProductFiltersInput,
} from "@criation/validation";
import { Router } from "express";

import { categories, products } from "../data/catalog";
import { paginate, sendNotFound, sendSuccess } from "../lib/http";
import { validateRequest, validated } from "../middleware/validate";

type ProductFilters = ReturnType<typeof productFiltersSchema.parse>;

function toSummary(product: Product): ProductSummary {
  const thumbnail = product.images[0];
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    currency: product.currency,
    status: product.status,
    rating: product.rating ?? null,
    ...(isDefined(thumbnail) ? { thumbnail } : {}),
  };
}

function applyFilters(items: Product[], filters: ProductFilters): Product[] {
  const search = filters.search?.toLowerCase();

  return items.filter((product) => {
    if (filters.status && product.status !== filters.status) return false;
    if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
    if (isDefined(filters.minPrice) && product.price < filters.minPrice) return false;
    if (isDefined(filters.maxPrice) && product.price > filters.maxPrice) return false;
    if (filters.tags?.length && !filters.tags.some((tag) => product.tags.includes(tag))) {
      return false;
    }
    if (search && !product.name.toLowerCase().includes(search)) return false;
    return true;
  });
}

export function productsRouter(): Router {
  const router = Router();

  router.get("/products", validateRequest(productFiltersSchema, "query"), (_req, res) => {
    const filters = validated<ProductFilters>(res);
    const matches = applyFilters(products, filters);
    const pageSize = Math.min(filters.pageSize, PAGINATION.maxPageSize);
    sendSuccess(res, paginate(matches.map(toSummary), filters.page, pageSize));
  });

  router.get("/products/:id", (req, res) => {
    const product = products.find(
      (item) => item.id === req.params.id || item.slug === req.params.id,
    );
    if (!product) {
      sendNotFound(res, `No product with id or slug "${req.params.id}"`);
      return;
    }
    sendSuccess(res, product);
  });

  router.post("/products", validateRequest(createProductSchema), (_req, res) => {
    const input = validated<Record<string, unknown>>(res);
    const now = new Date().toISOString();
    const product = {
      ...input,
      id: `prd_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: now,
      updatedAt: now,
    } as Product;

    products.push(product);
    sendSuccess(res, product, 201);
  });

  router.get("/categories", (_req, res) => {
    sendSuccess(res, categories);
  });

  return router;
}

export type { ProductFiltersInput };
