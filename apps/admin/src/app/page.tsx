import { OrderStatus, ProductStatus, type Product } from "@criation/types";
import { Badge, Card, PriceTag } from "@criation/ui/web";
import { formatDate, formatNumber, sumBy } from "@criation/utils";

import { appConfig } from "@/lib/config";

// Sample rows stand in for `api.products.list()` until the dashboard is wired
// to the backend; the shapes come from `@criation/types`.
const inventory: Array<Pick<Product, "id" | "name" | "price" | "currency" | "status">> = [
  {
    id: "prd_linen_shirt",
    name: "Linen Shirt",
    price: 249900,
    currency: "INR",
    status: ProductStatus.Active,
  },
  {
    id: "prd_canvas_tote",
    name: "Canvas Tote",
    price: 129900,
    currency: "INR",
    status: ProductStatus.Active,
  },
  {
    id: "prd_wool_scarf",
    name: "Wool Scarf",
    price: 189900,
    currency: "INR",
    status: ProductStatus.Draft,
  },
];

const catalogValue = sumBy(inventory, (item) => item.price);

// Fixed so the server and client render the same string. Real pages read this
// from the API response rather than the clock.
const CATALOG_UPDATED_AT = "2026-01-15T10:00:00.000Z";

export default function AdminDashboard() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <Badge tone="warning">Admin</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">{appConfig.appName}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          API: {appConfig.apiUrl} · updated {formatDate(CATALOG_UPDATED_AT)} ·{" "}
          {formatNumber(inventory.length)} products tracked.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Catalog value" subtitle="Sum of listed prices">
          <PriceTag amount={catalogValue} currency="INR" />
        </Card>
        <Card title="Latest order status" subtitle="Most recent fulfilment step">
          <Badge tone="success">{OrderStatus.Shipped}</Badge>
        </Card>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Inventory</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-md border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 pr-4 font-medium">Product</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-900">
                  <td className="py-3 pr-4">{item.name}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={item.status === ProductStatus.Active ? "success" : "neutral"}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <PriceTag amount={item.price} currency={item.currency} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
