"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  recommendations?: Array<{ id: string; name: string; price: number; slug: string }>;
}

export function AIChatWidget() {
  const { products, orders, formatPrice } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "bot",
      text: "Namaste! 🙏 I am Criation's AI Shopping & Dropship Concierge. How can I assist you today? Ask me about gifts, order tracking, or trending dropship items!",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickPrompts = [
    "🎁 Gift ideas under ₹500",
    "📦 Track my order",
    "⚡ Trending dropship winners",
    "🔄 Return policy",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      generateBotReply(query);
      setIsTyping(false);
    }, 700);
  };

  const generateBotReply = (query: string) => {
    const q = query.toLowerCase();
    let replyText = "";
    let recs: Array<{ id: string; name: string; price: number; slug: string }> = [];

    if (q.includes("gift") || q.includes("under") || q.includes("500") || q.includes("recommend")) {
      const affordable = products.filter((p) => p.price <= 500).slice(0, 3);
      replyText = "Here are our top handcrafted picks under ₹500, direct from Indian artisans:";
      recs = affordable.map((p) => ({ id: p.id, name: p.name, price: p.price, slug: p.slug }));
    } else if (q.includes("track") || q.includes("order") || q.includes("status")) {
      if (orders.length > 0) {
        const latest = orders[0];
        replyText = `Your latest order #${latest.orderNumber} is currently **${latest.status.toUpperCase()}**.\nAWB: ${latest.courier.trackingNumber} via ${latest.courier.name}. Expected delivery: ${latest.courier.estimatedDelivery}.`;
      } else {
        replyText = "You haven't placed any orders yet. Once you place an order, you can track live BlueDart courier updates right here!";
      }
    } else if (q.includes("dropship") || q.includes("winner") || q.includes("trending")) {
      const winners = products.filter((p) => p.isDropship).slice(0, 3);
      replyText = "Here are our viral dropship winning products with 65%+ profit margins and 1-day factory dispatch:";
      recs = winners.map((p) => ({ id: p.id, name: p.name, price: p.price, slug: p.slug }));
    } else if (q.includes("return") || q.includes("refund")) {
      replyText = "We offer a **7-Day Doorstep Return Policy** across India! If any fragile clay diya or craft arrives damaged, you can request an instant replacement or full wallet refund from your Orders page.";
    } else {
      replyText = `I found some popular artisan creations that match "${query}". Let me know if you'd like more details on shipping or bulk pricing!`;
      const matches = products.filter((p) => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)).slice(0, 3);
      recs = (matches.length > 0 ? matches : products.slice(0, 3)).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        slug: p.slug,
      }));
    }

    const botMsg: ChatMessage = {
      id: `bot_${Date.now()}`,
      sender: "bot",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      recommendations: recs,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <>
      {/* Floating Trigger Button on the BOTTOM RIGHT (Sleek Round FAB with centered Sparkles icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xl shadow-indigo-600/35 hover:shadow-2xl hover:shadow-indigo-600/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center border border-white/25 cursor-pointer backdrop-blur-xs group"
        aria-label="Open AI Assistant"
        title="Criation AI Shopping Concierge"
      >
        <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />

        {/* Hover Tooltip Label */}
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-zinc-900/95 dark:bg-zinc-800/95 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-white/15 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          Criation AI ✨
        </span>
      </button>

      {/* Chat Window Modal (Rich Dark & Light Mode Support) */}
      {isOpen && (
        <div className="fixed bottom-24 sm:bottom-22 right-4 sm:right-6 z-50 w-full max-w-[calc(100vw-2rem)] sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[78vh] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  Criation AI Concierge
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-indigo-100">24/7 Instant Shopping & Tracking Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-zinc-50/50 dark:bg-zinc-950/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300"
                  }`}
                >
                  {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-purple-700 dark:text-purple-300" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed shadow-2xs ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-xs"
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Recommendation Cards */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {m.recommendations.map((rec) => (
                        <Link
                          key={rec.id}
                          href={`/products/${rec.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors text-zinc-900 dark:text-zinc-100 group"
                        >
                          <span className="font-semibold truncate max-w-[170px] text-zinc-900 dark:text-zinc-100">{rec.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {formatPrice(rec.price)}
                            </span>
                            <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-indigo-500" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <span className={`text-[9px] mt-1 block text-right ${m.sender === "user" ? "text-indigo-200" : "text-zinc-400 dark:text-zinc-500"}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-zinc-500 dark:text-zinc-400 text-xs italic">
                <Bot className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span>Criation AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 disabled:opacity-50 text-white hover:bg-indigo-500 transition-colors shrink-0 shadow-xs cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
