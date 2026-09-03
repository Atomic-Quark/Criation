"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  Truck,
  RotateCcw,
  CreditCard,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";

export default function SupportPage() {
  const { showToast } = useStore();

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How are handcrafted products packed to prevent shipping damage?",
      a: "Every delicate pearl vase, crystal diya, and crochet charm is nestled inside multi-layered shockproof air-cushion packaging and shipped in heavy-gauge corrugated gift boxes.",
    },
    {
      q: "What is the return and replacement policy?",
      a: "We offer a 7-day doorstep return policy across India! If your item arrives damaged or you're unsatisfied, simply go to your Orders page and click 'Request Return' for an instant replacement or full wallet refund.",
    },
    {
      q: "How long does standard vs express shipping take?",
      a: "Standard shipping takes 3-4 business days. Priority Express Air Cargo arrives within 2 business days in metro cities.",
    },
    {
      q: "How can I become a verified artisan seller on Criation?",
      a: "Visit the Seller Portal (/seller), click 'Add New Craft Item', and complete your artisan KYC to begin selling directly to nationwide buyers.",
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    showToast("Support Ticket Created! 🎫", `Ticket #${ticketId} received. Our support team will reply to ${ticketEmail} within 2 hours.`, "success");
    setTicketSubject("");
    setTicketMessage("");
    setTicketEmail("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
          24/7 Customer Help Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
          How can we help you today?
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Find instant answers to orders, artisanal craft queries, and dropshipping fulfillment.
        </p>
      </div>

      {/* FAQs and Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" /> Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-zinc-400">{activeFaq === idx ? "−" : "+"}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" /> Send a Support Message
          </h3>

          <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold block mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={ticketEmail}
                onChange={(e) => setTicketEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Order #CR-9824 tracking query"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your issue in detail..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Support Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
