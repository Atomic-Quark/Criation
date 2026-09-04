"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Paperclip,
  CheckCheck,
  Circle,
  Clock,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Store,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface MessageItem {
  id: string;
  sender: "artisan" | "user" | "support";
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  isArtisan: boolean;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  productRef?: {
    name: string;
    image: string;
    price: number;
    orderId?: string;
  };
  messages: MessageItem[];
}

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Meera Devi",
    role: "Master Artisan · Blue Pottery Guild",
    location: "Jaipur, Rajasthan",
    avatar: "/products/craft-item-12.jpeg",
    isArtisan: true,
    isOnline: true,
    unreadCount: 1,
    lastMessage: "Namaste! Your custom turquoise floral vase has been shaped and is ready for kiln firing...",
    lastTime: "10:42 AM",
    productRef: {
      name: "Royal Empress Pearl & Gem Encrusted Vase",
      image: "/products/craft-item-12.jpeg",
      price: 1299,
      orderId: "CR-98214",
    },
    messages: [
      {
        id: "m-1",
        sender: "user",
        text: "Namaste Meera Ji! Can the vase have extra gold detailing around the neck like in the photos?",
        time: "Yesterday, 4:15 PM",
        status: "read",
      },
      {
        id: "m-2",
        sender: "artisan",
        text: "Namaste! Absolutely. We use authentic 24k gold foil leafing on the neck motifs. Here is the preliminary clay moulding before glaze firing.",
        time: "Yesterday, 5:30 PM",
        status: "read",
      },
      {
        id: "m-3",
        sender: "artisan",
        text: "Namaste! Your custom turquoise floral vase has been shaped and is ready for kiln firing. It will dispatch in 2 days with wooden safety crating.",
        time: "10:42 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Radha Sharma",
    role: "Artisan Leader · Crochet & Charms Guild",
    location: "Varanasi, UP",
    avatar: "/products/craft-item-01.jpeg",
    isArtisan: true,
    isOnline: false,
    unreadCount: 1,
    lastMessage: "Thank you for your order! We added a complimentary sunflower mini charm in your box 🌻",
    lastTime: "Yesterday",
    productRef: {
      name: "Sunflower Joy Artisan Crochet Keychain",
      image: "/products/craft-item-01.jpeg",
      price: 199,
      orderId: "CR-98102",
    },
    messages: [
      {
        id: "m-201",
        sender: "user",
        text: "Hi Radha! I ordered 4 sunflower keychains for festive gifting. The colors are so vibrant!",
        time: "Aug 31, 2:00 PM",
        status: "read",
      },
      {
        id: "m-202",
        sender: "artisan",
        text: "Thank you for your order! We added a complimentary sunflower mini charm in your box 🌻 Our women's guild in Varanasi sends warm blessings!",
        time: "Yesterday, 11:20 AM",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv-3",
    name: "Criation Care & Logistics",
    role: "Verified Platform Support & Concierge",
    location: "Mumbai Hub",
    avatar: "/products/craft-item-26.jpeg",
    isArtisan: false,
    isOnline: true,
    unreadCount: 0,
    lastMessage: "Your Priority Air Cargo shipment #CR-98214 is out for delivery today with BlueDart.",
    lastTime: "2 days ago",
    productRef: {
      name: "Order #CR-98214 Support",
      image: "/products/craft-item-26.jpeg",
      price: 1498,
      orderId: "CR-98214",
    },
    messages: [
      {
        id: "m-301",
        sender: "support",
        text: "Welcome to Criation Concierge! You have 2 active artisan orders. How can our craft team assist you today?",
        time: "Aug 29, 9:00 AM",
        status: "read",
      },
      {
        id: "m-302",
        sender: "support",
        text: "Your Priority Air Cargo shipment #CR-98214 is out for delivery today with BlueDart. Real-time courier updates are active on your Orders page.",
        time: "2 days ago",
        status: "read",
      },
    ],
  },
];

export default function MessagesPage() {
  const { formatPrice, showToast } = useStore();

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: MessageItem = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      time: "Just now",
      status: "sent",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: newMessage.text,
            lastTime: "Just now",
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setInputText("");
    showToast("Message Sent ✉️", `Your message was delivered to ${activeConv.name}.`, "success");
  };

  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    setIsMobileListOpen(false);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e0d4] dark:border-[#2e2822]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#fdf2ef] dark:bg-[#251915] border border-[#f5d5cc] dark:border-[#452620] flex items-center justify-center text-[#c25e3f] dark:text-[#d97757] shadow-2xs shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241f1c] dark:text-[#f4ece1] tracking-tight flex items-center gap-2.5">
              <span>Artisan & Concierge Messages</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#c25e3f] text-white">
                2 New
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#756c63] dark:text-[#a59b90] mt-0.5">
              Direct live communication with rural master craftswomen and dedicated Criation concierge support.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/deals"
            className="px-4 py-2 rounded-2xl border border-[#e8e0d4] dark:border-[#352f29] bg-white dark:bg-[#1c1916] text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b] transition-colors flex items-center gap-1.5"
          >
            <span>Browse Flash Deals</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8a8075]" />
          </Link>
          <Link
            href="/support"
            className="px-4 py-2 rounded-2xl bg-[#c25e3f] hover:bg-[#a84d31] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </Link>
        </div>
      </div>

      {/* Main Messaging Layout */}
      <div className="bg-white dark:bg-[#1c1916] rounded-3xl border border-[#e8e0d4] dark:border-[#352f29] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Conversations List */}
        <div
          className={`lg:col-span-5 xl:col-span-4 border-r border-[#e8e0d4] dark:border-[#352f29] flex flex-col ${
            isMobileListOpen ? "block" : "hidden lg:flex"
          }`}
        >
          {/* Search Box */}
          <div className="p-4 border-b border-[#e8e0d4] dark:border-[#352f29]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8a8075] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search artisans, guilds, support..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#faf7f2] dark:bg-[#24201c] border border-[#e8e0d4] dark:border-[#352f29] text-[#241f1c] dark:text-[#f4ece1] placeholder:text-[#8a8075] focus:outline-hidden focus:border-[#c25e3f]"
              />
            </div>
          </div>

          {/* Conversations Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#e8e0d4]/60 dark:divide-[#352f29]/60">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3.5 cursor-pointer ${
                    isActive
                      ? "bg-[#faf7f2] dark:bg-[#231f1b]"
                      : "hover:bg-[#faf7f2]/60 dark:hover:bg-[#231f1b]/60"
                  }`}
                >
                  <div className="product-stage-backdrop relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-[#e8e0d4] dark:border-[#352f29]">
                    <Image
                      src={conv.avatar}
                      alt={conv.name}
                      fill
                      className="product-image-aesthetic object-cover"
                      sizes="48px"
                    />
                    <div className="product-sheen-overlay" />
                    {conv.isOnline && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#56745f] border-2 border-white dark:border-[#1c1916] z-3" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-semibold text-xs text-[#241f1c] dark:text-[#f4ece1] truncate">
                        {conv.name}
                      </h4>
                      <span className="text-[10px] text-[#8a8075] shrink-0 font-mono">
                        {conv.lastTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8a8075] dark:text-[#9e9489] truncate font-medium mb-1">
                      {conv.role}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-[#756c63] dark:text-[#a59b90] line-clamp-1 leading-snug">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#c25e3f] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation Stream */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-[#e8e0d4] dark:border-[#352f29] bg-[#faf7f2]/50 dark:bg-[#181512]/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileListOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#756c63] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="product-stage-backdrop relative w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-[#e8e0d4] dark:border-[#352f29]">
                <Image
                  src={activeConv.avatar}
                  alt={activeConv.name}
                  fill
                  className="product-image-aesthetic object-cover"
                  sizes="44px"
                />
                <div className="product-sheen-overlay" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#241f1c] dark:text-[#f4ece1]">
                    {activeConv.name}
                  </h3>
                  {activeConv.isArtisan && (
                    <span className="px-2 py-0.5 rounded-md bg-[#fdf2ef] dark:bg-[#281b17] text-[#c25e3f] text-[10px] font-bold border border-[#f5d5cc] dark:border-[#452620] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#b58334]" /> Verified Artisan
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8a8075] dark:text-[#9e9489]">
                  {activeConv.role} · {activeConv.location}
                </p>
              </div>
            </div>

            {activeConv.productRef && (
              <div className="hidden sm:flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1c1916] border border-[#e8e0d4] dark:border-[#352f29] text-xs">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={activeConv.productRef.image}
                    alt={activeConv.productRef.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="text-left leading-tight">
                  <p className="font-semibold text-[11px] text-[#241f1c] dark:text-[#f4ece1] truncate max-w-[120px]">
                    {activeConv.productRef.name}
                  </p>
                  <p className="font-serif text-[10px] text-[#c25e3f] font-bold">
                    {formatPrice(activeConv.productRef.price)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#faf7f2]/20 dark:bg-[#141210]/30">
            {activeConv.messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-[#c25e3f] text-white rounded-br-xs"
                        : "bg-white dark:bg-[#231f1b] text-[#241f1c] dark:text-[#f4ece1] border border-[#e8e0d4] dark:border-[#352f29] rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-[#8a8075]">
                    <span>{msg.time}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#c25e3f]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Pills */}
          <div className="px-4 py-2 border-t border-[#e8e0d4]/80 dark:border-[#352f29]/80 bg-[#faf7f2]/40 dark:bg-[#181512]/40 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setInputText("Can you please share photos of the finished piece?")}
              className="px-3 py-1 rounded-lg bg-white dark:bg-[#24201c] border border-[#e8e0d4] dark:border-[#352f29] text-[11px] text-[#756c63] dark:text-[#a59b90] hover:text-[#c25e3f] shrink-0 cursor-pointer"
            >
              📷 Request finished photos
            </button>
            <button
              onClick={() => setInputText("When will this order dispatch?")}
              className="px-3 py-1 rounded-lg bg-white dark:bg-[#24201c] border border-[#e8e0d4] dark:border-[#352f29] text-[11px] text-[#756c63] dark:text-[#a59b90] hover:text-[#c25e3f] shrink-0 cursor-pointer"
            >
              🚚 Inquire dispatch date
            </button>
            <button
              onClick={() => setInputText("Can I customize the dimensions or color?")}
              className="px-3 py-1 rounded-lg bg-white dark:bg-[#24201c] border border-[#e8e0d4] dark:border-[#352f29] text-[11px] text-[#756c63] dark:text-[#a59b90] hover:text-[#c25e3f] shrink-0 cursor-pointer"
            >
              🎨 Customization request
            </button>
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-[#e8e0d4] dark:border-[#352f29] bg-white dark:bg-[#1c1916] flex items-center gap-2.5"
          >
            <button
              type="button"
              className="p-2.5 rounded-xl text-[#8a8075] hover:text-[#241f1c] dark:hover:text-[#f4ece1] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b] transition-colors cursor-pointer"
              title="Attach photo or order proof"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Reply to ${activeConv.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#faf7f2] dark:bg-[#24201c] border border-[#e8e0d4] dark:border-[#352f29] text-[#241f1c] dark:text-[#f4ece1] placeholder:text-[#8a8075] focus:outline-hidden focus:border-[#c25e3f]"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-[#c25e3f] hover:bg-[#a84d31] text-white text-xs font-semibold shadow-md shadow-[#c25e3f]/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
