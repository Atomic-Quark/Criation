"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  Share2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { downloadTaxInvoice } from "@/lib/invoice/generateInvoice";

export default function OrderTrackingPage() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { orders, cancelOrder, requestReturn, formatPrice, showToast, user } = useStore();
  const order = orders.find((o) => o.id === rawId || o.orderNumber === rawId);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("Defective / Damaged in transit");

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Order Not Found</h1>
        <p className="text-xs text-zinc-500">No order exists with ID #{rawId}.</p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    downloadTaxInvoice({
      invoiceNumber: order.orderNumber,
      invoiceDate: new Date(order.date || Date.now()).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      transactionReference: order.transactionId || `TXN_CR_${order.id.slice(-6).toUpperCase()}`,
      paymentMethod: order.paymentMethod || "UPI",
      customer: {
        name: order.shippingAddress?.fullName || user.name,
        email: user.email,
        phone: order.shippingAddress?.phone || user.phone,
        address: `${order.shippingAddress?.line1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`,
      },
      items: order.items.map((it) => {
        const taxable = Math.round((it.price / 1.18) * 100) / 100;
        const taxVal = Math.round((it.price - taxable) * 100) / 100;
        return {
          name: it.name,
          description: it.variantName ? `Variant: ${it.variantName}` : "Artisan Handcrafted Goods",
          hsnSac: "580810",
          quantity: it.quantity,
          rate: taxable,
          taxableAmount: taxable * it.quantity,
          cgst: Math.round((taxVal * it.quantity) / 2),
          sgst: Math.round((taxVal * it.quantity) / 2),
          total: it.price * it.quantity,
        };
      }),
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      totalAmount: order.total,
      type: "order",
    });
    showToast("Tax Invoice Downloaded 📄", `Invoice #${order.orderNumber} saved to downloads and print preview opened.`, "success");
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cancelOrder(order.id, cancelReason);
    setIsCancelModalOpen(false);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestReturn(order.id, returnReason);
    setIsReturnModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/orders" className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Orders
            </Link>
            <span>/</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">#{order.orderNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Track Shipment #{order.orderNumber}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4 text-indigo-500" /> Download Tax Invoice
          </button>

          {order.canCancel && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
            >
              Cancel Order
            </button>
          )}

          {order.canReturn && (
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors"
            >
              Request Return
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipment Stepper + Map Simulation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step Timeline Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Live Courier Tracking
                </h3>
              </div>
              <span className="text-xs font-semibold text-zinc-500">
                AWB: <strong className="font-mono text-zinc-900 dark:text-zinc-100">{order.courier.trackingNumber}</strong>
              </span>
            </div>

            {/* Visual Stepper */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
              {order.trackingTimeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Dot */}
                  <span
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      step.completed
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30"
                        : step.current
                        ? "bg-amber-500 border-amber-500 text-zinc-950 animate-pulse"
                        : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </span>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className={`text-sm font-bold ${step.completed || step.current ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
                        {step.title}
                      </h4>
                      <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Location: {step.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated GPS Transit Route Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" /> GPS Transit Map Route
            </h3>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-800">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Origin Workshop</span>
                <h4 className="font-bold text-sm">Jaipur Artisan Studio</h4>
                <p className="text-[11px] text-zinc-400">Packed & Dispatched</p>
              </div>

              <div className="flex-1 flex items-center justify-center px-4 w-full">
                <div className="w-full h-1 bg-zinc-700 relative rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-3/4 rounded-full" />
                </div>
              </div>

              <div className="text-center md:text-right">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Destination</span>
                <h4 className="font-bold text-sm">{order.shippingAddress.city}, {order.shippingAddress.state}</h4>
                <p className="text-[11px] text-zinc-400">PIN {order.shippingAddress.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Details & Address Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Items in Order */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Items in Package ({order.items.length})
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]">{item.name}</p>
                      <p className="text-zinc-500">Qty: {item.quantity} · {item.variantName || "Standard"}</p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <span>Total Paid</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" /> Delivery Address
            </h4>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{order.shippingAddress.fullName}</p>
            <p className="text-zinc-500 leading-relaxed">
              {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-zinc-500">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cancel Order #{order.orderNumber}?</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Are you sure you want to cancel? If you paid online, {formatPrice(order.total)} will be refunded immediately to your Criation Wallet.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-900 dark:text-zinc-100"
                >
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found cheaper alternative">Found cheaper alternative</option>
                  <option value="Delivery time too long">Delivery time too long</option>
                  <option value="Change shipping address">Change shipping address</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
