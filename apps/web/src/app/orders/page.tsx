"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Search,
  ExternalLink,
} from "lucide-react";

export default function OrdersPage() {
  const { orders, formatPrice } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus !== "all" && ord.status !== filterStatus) return false;
    if (
      searchQuery.trim() &&
      !ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ord.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Delivered</span>;
      case "shipped":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">In Transit (Shipped)</span>;
      case "confirmed":
      case "processing":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">Processing & Packing</span>;
      case "cancelled":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">Cancelled</span>;
      case "returned":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Return In Progress</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          My Orders & Shipments
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Track real-time courier status, download tax invoices, and manage returns.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {["all", "confirmed", "shipped", "delivered", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase transition-colors whitespace-nowrap ${
                filterStatus === st
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-900 dark:text-zinc-100"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-3">
          <Package className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">No orders found</h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            You haven't placed any orders matching this filter yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-colors"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                      Order #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Placed on {new Date(order.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} · Paid via {order.paymentMethod.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-zinc-900 dark:text-zinc-100">
                    {formatPrice(order.total)}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    Track Shipment <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items Thumbnails List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="text-xs min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                      <p className="text-zinc-500">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Courier Tracking snippet */}
              <div className="text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  Courier: <strong>{order.courier.name}</strong> (AWB: {order.courier.trackingNumber})
                </span>
                <span>Expected: <strong>{order.courier.estimatedDelivery}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
