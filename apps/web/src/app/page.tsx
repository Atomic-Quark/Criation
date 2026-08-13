import { ProductStatus, type ProductSummary } from "@criation/types";
import { Badge, Card, PriceTag } from "@criation/ui/web";
import { formatDate, titleCase } from "@criation/utils";
import { productFiltersSchema } from "@criation/validation";

import { appConfig } from "@/lib/config";

// Sample data stands in for `api.products.list()` until the backend is wired
// up; the important part is that the types come from `@criation/types`.
const featured: ProductSummary[] = [
  {
    id: "prd_linen_shirt",
    name: "Linen Shirt",
    slug: "linen-shirt",
    price: 249900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 4.6,
  },
  {
    id: "prd_canvas_tote",
    name: "Canvas Tote",
    slug: "canvas-tote",
    price: 129900,
    currency: "INR",
    status: ProductStatus.Active,
    rating: 4.8,
  },
  {
    id: "prd_wool_scarf",
    name: "Wool Scarf",
    slug: "wool-scarf",
    price: 189900,
    currency: "INR",
    status: ProductStatus.Draft,
    rating: null,
  },
];

// Proves `@criation/validation` runs in the Next.js app: defaults are applied
// to an empty query exactly as they are on the backend.
const defaultFilters = productFiltersSchema.parse({});

// Fixed so the server and client render the same string. Real pages read this
// from the API response rather than the clock.
const CATALOG_UPDATED_AT = "2026-01-15T10:00:00.000Z";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <Badge tone="brand">Web</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">{appConfig.appName}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Running in {titleCase(appConfig.environment)} against{" "}
          <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
            {appConfig.apiUrl}
          </code>
          . Page {defaultFilters.page} · {defaultFilters.pageSize} per page · catalog updated{" "}
          {formatDate(CATALOG_UPDATED_AT)}.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((product) => (
          <Card
            key={product.id}
            title={product.name}
            subtitle={`/${product.slug}`}
            footer={<PriceTag amount={product.price} currency={product.currency} />}
          >
            <Badge tone={product.status === ProductStatus.Active ? "success" : "neutral"}>
              {product.status}
            </Badge>
          </Card>
        ))}
      </section>
    </main>
  );
}
