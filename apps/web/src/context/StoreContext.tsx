"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Address,
  CartItem,
  CategoryItem,
  CouponItem,
  NotificationItem,
  Order,
  ProductItem,
  ProductVariant,
  Role,
  SourcingRequest,
  SupplierItem,
  UserProfile,
  WalletTransaction
} from "@/types/store";
import {
  initialCategories,
  initialCoupons,
  initialNotifications,
  initialOrders,
  initialProducts,
  initialSourcingRequests,
  initialSuppliers,
  initialUserProfile,
  initialWalletTransactions,
} from "@/lib/data/mockCatalog";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: "success" | "info" | "warning" | "error";
}

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  INR: { symbol: "₹", rate: 1 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0095 },
};

interface StoreContextType {
  // Catalog
  products: ProductItem[];
  categories: CategoryItem[];
  suppliers: SupplierItem[];
  sourcingRequests: SourcingRequest[];
  addProduct: (product: Omit<ProductItem, "id" | "createdAt">) => ProductItem;
  updateProduct: (id: string, updates: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (idOrSlug: string) => ProductItem | undefined;
  addSourcingRequest: (req: Omit<SourcingRequest, "id" | "date" | "status">) => void;
  updateSourcingRequest: (id: string, updates: Partial<SourcingRequest>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: ProductItem, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  savedForLater: CartItem[];
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;

  // Pricing & Coupons
  appliedCoupon: CouponItem | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTax: number;
  cartTotal: number;

  // Wishlist
  wishlist: ProductItem[];
  toggleWishlist: (product: ProductItem) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    items: Order["items"];
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    paymentMethod: Order["paymentMethod"];
  }) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order["status"], note?: string) => void;
  cancelOrder: (orderId: string, reason: string) => boolean;
  requestReturn: (orderId: string, reason: string) => boolean;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  addNotification: (notif: Omit<NotificationItem, "id" | "timestamp" | "isRead">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: ToastItem["type"]) => void;
  dismissToast: (id: string) => void;

  // User & Wallet
  user: UserProfile;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (email: string, password?: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  registerUser: (userData: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  authenticateAdmin: (pinOrKey?: string) => boolean;
  lockAdmin: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  walletTransactions: WalletTransaction[];
  addWalletMoney: (amount: number) => boolean;
  switchRole: (role: Role) => void;

  // Storage & Uploads
  uploadFile: (file: File, category?: string) => Promise<{ success: boolean; url: string; error?: string }>;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;

  // Sidebar & Navigation UI State (YouTube Style)
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isSidebarHovered: boolean;
  setIsSidebarHovered: (hovered: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amountInInr: number) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: "criation_products_v2",
  CART: "criation_cart_v1",
  SAVED_FOR_LATER: "criation_saved_v1",
  WISHLIST: "criation_wishlist_v1",
  ORDERS: "criation_orders_v1",
  NOTIFICATIONS: "criation_notifs_v1",
  USER: "criation_user_v1",
  WALLET_TX: "criation_wallet_v1",
  SOURCING: "criation_sourcing_v1",
  COUPON: "criation_coupon_v1",
  CURRENCY: "criation_currency_v1",
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // States
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [categories] = useState<CategoryItem[]>(initialCategories);
  const [suppliers] = useState<SupplierItem[]>(initialSuppliers);
  const [sourcingRequests, setSourcingRequests] = useState<SourcingRequest[]>(initialSourcingRequests);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(initialWalletTransactions);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("criation_theme_v1");
      const isDomDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
      const isMediaDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      let effectiveTheme: "light" | "dark" = "light";
      if (savedTheme === "dark" || savedTheme === "light") {
        effectiveTheme = savedTheme;
      } else if (isDomDark || isMediaDark) {
        effectiveTheme = "dark";
      }

      setThemeState(effectiveTheme);
      if (effectiveTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
      }

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedWallet = localStorage.getItem(STORAGE_KEYS.WALLET_TX);
      if (savedWallet) setWalletTransactions(JSON.parse(savedWallet));

      const savedSourcing = localStorage.getItem(STORAGE_KEYS.SOURCING);
      if (savedSourcing) setSourcingRequests(JSON.parse(savedSourcing));

      const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (savedCurrency && (savedCurrency in CURRENCY_RATES)) {
        setCurrencyState(savedCurrency as CurrencyCode);
      }
    } catch (e) {
      console.warn("Storage hydration failed:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
    try {
      localStorage.setItem("criation_theme_v1", t);
    } catch (_) {}
  };

  const toggleTheme = () => {
    const isCurrentlyDark = theme === "dark" || (typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
    const nextTheme = isCurrentlyDark ? "light" : "dark";
    setTheme(nextTheme);
  };

  // Sync state to localStorage when changes occur (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.WALLET_TX, JSON.stringify(walletTransactions));
      localStorage.setItem(STORAGE_KEYS.SOURCING, JSON.stringify(sourcingRequests));
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
  }, [isHydrated, products, cart, wishlist, orders, notifications, user, walletTransactions, sourcingRequests, currency]);

  // Toast Helper
  const showToast = (title: string, message?: string, type: ToastItem["type"] = "success") => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Currency helpers
  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    showToast("Currency Updated", `Switched pricing display to ${c} (${CURRENCY_RATES[c].symbol})`, "info");
  };

  const formatPrice = (amountInInr: number) => {
    const { symbol, rate } = CURRENCY_RATES[currency];
    const converted = amountInInr * rate;
    if (currency === "INR") {
      return `₹${amountInInr.toLocaleString("en-IN")}`;
    }
    return `${symbol}${converted.toFixed(2)}`;
  };

  // Catalog Methods
  const addProduct = (newProd: Omit<ProductItem, "id" | "createdAt">): ProductItem => {
    const slug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = `prd_${Date.now().toString(36)}`;
    const product: ProductItem = {
      ...newProd,
      id,
      slug: `${slug}-${id.slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [product, ...prev]);
    showToast("Product Added Successfully", `"${product.name}" is now live on the storefront.`, "success");
    addNotification({
      title: "New Product Listed",
      message: `"${product.name}" was published with stock of ${product.stock} units.`,
      type: "system",
      priority: "normal",
      link: `/products/${product.slug}`,
    });
    return product;
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast("Product Updated", "Catalog modifications saved successfully.", "info");
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product Removed", "Item has been removed from catalog.", "warning");
  };

  const getProductById = (idOrSlug: string): ProductItem | undefined => {
    return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  };

  const addSourcingRequest = (req: Omit<SourcingRequest, "id" | "date" | "status">) => {
    const newReq: SourcingRequest = {
      ...req,
      id: `src_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setSourcingRequests((prev) => [newReq, ...prev]);
    showToast("Sourcing Request Submitted", `Suppliers will quote for ${newReq.productName} within 24 hours.`, "success");
    addNotification({
      title: "Sourcing Inquiry Dispatched",
      message: `Inquiry #${newReq.id} for "${newReq.productName}" sent to suppliers.`,
      type: "dropship",
      priority: "normal",
      link: "/dropship",
    });
  };

  const updateSourcingRequest = (id: string, updates: Partial<SourcingRequest>) => {
    setSourcingRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Cart Methods
  const addToCart = (product: ProductItem, variant?: ProductVariant, quantity: number = 1) => {
    const cartItemId = variant ? `${product.id}_${variant.id}` : product.id;
    const itemPrice = variant ? variant.price : product.price;
    const compareAt = variant?.compareAtPrice ?? product.compareAtPrice;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          variantId: variant?.id,
          name: product.name,
          image: product.images[0]?.url || "/products/craft-item-01.jpeg",
          price: itemPrice,
          compareAtPrice: compareAt,
          quantity,
          variantName: variant?.name,
          selectedColor: variant?.color,
          selectedSize: variant?.size,
          category: product.categoryName,
        },
      ];
    });

    showToast("Added to Cart", `${product.name} (${quantity}x) added to your shopping bag.`);
    setIsMiniCartOpen(true);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Item Removed", "Removed item from shopping cart.", "info");
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const saveForLater = (id: string) => {
    const itemToSave = cart.find((i) => i.id === id);
    if (!itemToSave) return;
    setCart((prev) => prev.filter((i) => i.id !== id));
    setSavedForLater((prev) => [...prev, itemToSave]);
    showToast("Saved for Later", `"${itemToSave.name}" moved to your saved items list.`, "info");
  };

  const moveToCart = (id: string) => {
    const itemToMove = savedForLater.find((i) => i.id === id);
    if (!itemToMove) return;
    setSavedForLater((prev) => prev.filter((i) => i.id !== id));
    setCart((prev) => [...prev, itemToMove]);
    showToast("Moved to Cart", `"${itemToMove.name}" is back in your cart.`);
  };

  // Pricing Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "percentage") {
      const disc = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      return appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
    }
    return Math.min(appliedCoupon.discountValue, cartSubtotal);
  }, [cartSubtotal, appliedCoupon]);

  const cartShippingFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 499 ? 0 : 49;
  }, [cartSubtotal, cart.length]);

  const cartTax = useMemo(() => {
    const taxable = Math.max(0, cartSubtotal - cartDiscount);
    return Math.round(taxable * 0.05); // 5% GST
  }, [cartSubtotal, cartDiscount]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount + cartShippingFee + cartTax);
  }, [cartSubtotal, cartDiscount, cartShippingFee, cartTax]);

  // Coupon Engine
  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = initialCoupons.find((c) => c.code.toUpperCase() === normalized);
    if (!found) {
      return { success: false, message: `Promo code "${code}" is invalid or expired.` };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Add ${formatPrice(found.minOrderValue - cartSubtotal)} more to apply ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast("Coupon Applied!", `Saved with ${found.code}: ${found.description}`, "success");
    return { success: true, message: `Applied ${found.code} successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon Removed", "Discount code cleared.", "info");
  };

  // Wishlist Methods
  const toggleWishlist = (product: ProductItem) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast("Removed from Wishlist", `"${product.name}" removed.`, "info");
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast("Saved to Wishlist", `"${product.name}" saved to your wishlist!`, "success");
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Orders Engine
  const createOrder = (orderData: {
    items: Order["items"];
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    paymentMethod: Order["paymentMethod"];
  }): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CR-${randomSuffix}`;
    const orderId = orderNumber;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      date: now,
      status: "confirmed",
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shippingFee: orderData.shippingFee,
      tax: orderData.tax,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "paid",
      transactionId: `TXN_${Date.now()}`,
      courier: {
        name: "BlueDart Express Priority",
        trackingNumber: `BLU${Math.floor(10000000 + Math.random() * 90000000)}IN`,
        trackingUrl: `https://bluedart.example/track/BLU${orderNumber}`,
        estimatedDelivery: "3-4 Business Days",
      },
      trackingTimeline: [
        {
          status: "order_placed",
          title: "Order Placed & Confirmed",
          description: "Payment received. Order dispatched to artisan workshop for handcrafting & packing.",
          timestamp: "Just now",
          location: "Criation Central Fulfillment",
          completed: true,
          current: true,
        },
        {
          status: "packed",
          title: "Quality Check & Cushion Packing",
          description: "Items inspected and packaged in shockproof gift casing.",
          timestamp: "Expected in 4-6 hours",
          location: "Artisan Studio",
          completed: false,
          current: false,
        },
        {
          status: "shipped",
          title: "Dispatched with BlueDart",
          description: "Handed over to courier partner for express transit.",
          timestamp: "Expected tomorrow",
          location: "Regional Cargo Hub",
          completed: false,
          current: false,
        },
        {
          status: "out_for_delivery",
          title: "Out for Delivery",
          description: "Courier agent will contact you on your registered phone.",
          timestamp: "Pending",
          location: orderData.shippingAddress.city,
          completed: false,
          current: false,
        },
        {
          status: "delivered",
          title: "Delivered",
          description: "Package safely delivered to your doorstep.",
          timestamp: "Pending",
          location: orderData.shippingAddress.city,
          completed: false,
          current: false,
        },
      ],
      canCancel: true,
      canReturn: false,
    };

    // If paid via wallet, deduct wallet balance
    if (orderData.paymentMethod === "wallet") {
      setUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - orderData.total),
      }));
      setWalletTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: "debit",
          amount: orderData.total,
          description: `Payment for Order #${orderNumber}`,
          date: "Just now",
          status: "success",
          balanceAfter: Math.max(0, user.walletBalance - orderData.total),
        },
        ...prev,
      ]);
    }

    // Award loyalty points (10% of total)
    const pointsEarned = Math.round(orderData.total * 0.1);
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + pointsEarned,
    }));

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Secure asynchronous sync to MongoDB backend Order API
    if (typeof window !== "undefined") {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod,
          userEmail: user.email,
          userName: user.name,
          userPhone: user.phone,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data.order && orderData.paymentMethod !== "cod") {
              const intentRes = await fetch("/api/checkout/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.order.id }),
              });
              if (intentRes.ok) {
                const intentData = await intentRes.json();
                await fetch("/api/checkout/verify-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId: intentData.orderId,
                    gatewayOrderId: intentData.gatewayOrderId,
                    serverSignature: intentData.serverSignature,
                    paymentMethod: orderData.paymentMethod,
                  }),
                });
              }
            }
          }
        })
        .catch((err) => console.warn("[Order Backend Sync Notice]:", err.message));
    }

    addNotification({
      title: `Order #${orderNumber} Confirmed!`,
      message: `Your order for ${orderData.items.length} item(s) of ${formatPrice(orderData.total)} has been successfully placed.`,
      type: "order",
      priority: "high",
      link: `/orders/${orderId}`,
    });

    showToast("Order Confirmed! 🎉", `Order #${orderNumber} placed. Earned ${pointsEarned} loyalty points!`, "success");

    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"], note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId && ord.orderNumber !== orderId) return ord;
        return {
          ...ord,
          status,
          notes: note || ord.notes,
          trackingTimeline: ord.trackingTimeline.map((step) => {
            if (step.status === status) {
              return { ...step, completed: true, current: true, timestamp: "Updated just now" };
            }
            return step;
          }),
        };
      })
    );
    showToast("Order Status Updated", `Order #${orderId} moved to "${status}".`, "info");
    addNotification({
      title: `Order #${orderId} Update`,
      message: `Order status changed to ${status.toUpperCase()}.`,
      type: "order",
      priority: "normal",
      link: `/orders/${orderId}`,
    });
  };

  const cancelOrder = (orderId: string, reason: string): boolean => {
    const order = getOrderById(orderId);
    if (!order || !order.canCancel) {
      showToast("Cannot Cancel Order", "This order is already in transit or delivered.", "error");
      return false;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, status: "cancelled", canCancel: false, notes: `Cancelled: ${reason}` }
          : o
      )
    );

    // Refund to wallet if prepaid
    if (order.paymentStatus === "paid") {
      setUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + order.total,
      }));
      setWalletTransactions((prev) => [
        {
          id: `tx_${Date.now()}`,
          type: "credit",
          amount: order.total,
          description: `Refund for Cancelled Order #${order.orderNumber}`,
          date: "Just now",
          status: "success",
          balanceAfter: user.walletBalance + order.total,
        },
        ...prev,
      ]);
    }

    showToast("Order Cancelled", `Refund of ${formatPrice(order.total)} credited to your wallet.`, "info");
    addNotification({
      title: `Order #${orderId} Cancelled`,
      message: `Cancellation processed. Reason: ${reason}. Refund credited to wallet.`,
      type: "order",
      priority: "high",
      link: `/orders/${orderId}`,
    });
    return true;
  };

  const requestReturn = (orderId: string, reason: string): boolean => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, status: "returned", canReturn: false, notes: `Return requested: ${reason}` }
          : o
      )
    );
    showToast("Return Request Received", "Our courier will pick up the package in 2 business days.", "info");
    addNotification({
      title: `Return Requested for #${orderId}`,
      message: `Return pickup scheduled for order #${orderId}. Reason: ${reason}`,
      type: "order",
      priority: "normal",
      link: `/orders/${orderId}`,
    });
    return true;
  };

  // Notifications
  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const addNotification = (notif: Omit<NotificationItem, "id" | "timestamp" | "isRead">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: "Just now",
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast("Notifications Cleared", "All notifications marked as read.", "info");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // User Profile & Addresses
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast("Profile Updated", "Your account settings have been saved.", "success");
  };

  const addAddress = (addr: Omit<Address, "id">) => {
    const newAddr: Address = {
      ...addr,
      id: `addr_${Date.now()}`,
    };
    setUser((prev) => {
      let updatedAddresses = [...prev.addresses];
      if (newAddr.isDefault) {
        updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      return { ...prev, addresses: [...updatedAddresses, newAddr] };
    });
    showToast("Address Added", "New delivery destination saved.", "success");
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => {
        if (a.id !== id) return updates.isDefault ? { ...a, isDefault: false } : a;
        return { ...a, ...updates };
      }),
    }));
    showToast("Address Updated", "Delivery details changed.", "info");
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
    showToast("Address Removed", "Address removed from your book.", "info");
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
    }));
    showToast("Default Address Set", "Primary shipping destination updated.", "info");
  };

  const addWalletMoney = (amount: number): boolean => {
    if (amount <= 0) return false;
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    setWalletTransactions((prev) => [
      {
        id: `tx_${Date.now()}`,
        type: "credit",
        amount,
        description: "Instant Wallet Top-up (UPI/Card)",
        date: "Just now",
        status: "success",
        balanceAfter: user.walletBalance + amount,
      },
      ...prev,
    ]);
    showToast("Wallet Recharged! 💳", `Added ${formatPrice(amount)} to your Criation Wallet.`, "success");
    addNotification({
      title: "Wallet Recharged",
      message: `${formatPrice(amount)} credited. New balance: ${formatPrice(user.walletBalance + amount)}.`,
      type: "payment",
      priority: "normal",
      link: "/account",
    });
    return true;
  };

  const switchRole = (role: Role) => {
    if (role === "admin" && !user.isAdminVerified) {
      setUser((prev) => ({ ...prev, role: "admin", isAdminVerified: true, isAuthenticated: true }));
      showToast("Superadmin Activated 🛡️", "Master administrative privileges unlocked.", "success");
      return;
    }
    setUser((prev) => ({ ...prev, role }));
    showToast("Role Switched", `Active view changed to ${role.toUpperCase()} mode.`, "info");
  };

  // Authentication Methods
  const isAuthenticated = Boolean(user.isAuthenticated !== false && user.email !== "guest@criation.example");
  const isAdminAuthenticated = Boolean(user.isAdminVerified || user.role === "admin");

  const login = async (
    email: string,
    password?: string,
    role: Role = "customer"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser({ ...data.user, isAuthenticated: true });
        showToast("Welcome Back! 👋", `Signed in successfully as ${data.user.name}.`, "success");
        addNotification({
          title: "Login Successful",
          message: `Signed in via ${email}. Session verified.`,
          type: "system",
          priority: "normal",
          link: "/account",
        });
        return { success: true };
      } else {
        const errorMsg = data.error || "Invalid email or password.";
        showToast("Login Failed", errorMsg, "error");
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      console.warn("[StoreContext] login error:", err);
      const errorMsg = "Unable to connect to authentication service.";
      showToast("Network Error", errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const registerUser = async (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser({ ...data.user, isAuthenticated: true });
        setWalletTransactions((prev) => [
          {
            id: `tx_${Date.now()}`,
            type: "credit",
            amount: 100,
            description: "Welcome New User Bonus Credit",
            date: "Just now",
            status: "success",
            balanceAfter: data.user.walletBalance || 100,
          },
          ...prev,
        ]);
        showToast("Welcome to Criation! 🎉", "Account created successfully. ₹100 added to your Criation Wallet!", "success");
        addNotification({
          title: "Welcome Bonus Claimed",
          message: "₹100 credited to your wallet for signing up.",
          type: "payment",
          priority: "high",
          link: "/account",
        });
        return { success: true };
      } else {
        const errorMsg = data.error || "Failed to create account.";
        showToast("Registration Failed", errorMsg, "error");
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      console.warn("[StoreContext] register error:", err);
      const errorMsg = "Unable to connect to registration service.";
      showToast("Network Error", errorMsg, "error");
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    // Call logout API to clear HTTP cookies
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});

    setUser({
      id: "usr_guest",
      name: "Guest User",
      email: "guest@criation.example",
      phone: "",
      avatar: "/products/craft-item-01.jpeg",
      role: "customer",
      walletBalance: 0,
      loyaltyPoints: 0,
      tier: "Silver",
      addresses: [],
      joinedDate: "Today",
      twoFactorEnabled: false,
      isAuthenticated: false,
      isAdminVerified: false,
      notificationPreferences: {
        inApp: true,
        email: false,
        sms: false,
        whatsapp: false,
        push: false,
      },
    });
    showToast("Signed Out 👋", "You are now browsing in guest mode.", "info");
  };

  // File Upload Helper
  const uploadFile = async (file: File, category: string = "product"): Promise<{ success: boolean; url: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("userId", user.id || "anonymous");

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast("Upload Successful 📁", `File saved to Criation Storage: ${data.filename}`, "success");
        return { success: true, url: data.url };
      }
      showToast("Upload Failed", data.error || "Storage error", "error");
      return { success: false, url: "", error: data.error };
    } catch (e: any) {
      showToast("Upload Error", e.message || "Failed to upload file", "error");
      return { success: false, url: "", error: e.message };
    }
  };

  const authenticateAdmin = (): boolean => {
    if (user.role === "admin" && user.isAuthenticated) {
      showToast("Superadmin Active 🛡️", "Administrative access verified.", "success");
      return true;
    }
    showToast("Access Denied ❌", "Please sign in with verified Superadmin credentials.", "error");
    return false;
  };

  const lockAdmin = () => {
    setUser((prev) => ({
      ...prev,
      role: "customer",
      isAdminVerified: false,
    }));
    showToast("Admin Terminal Locked 🔒", "Superadmin panel has been secured.", "info");
  };

  const value: StoreContextType = {
    products,
    categories,
    suppliers,
    sourcingRequests,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    addSourcingRequest,
    updateSourcingRequest,

    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    savedForLater,
    saveForLater,
    moveToCart,
    isMiniCartOpen,
    setIsMiniCartOpen,

    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,

    wishlist,
    toggleWishlist,
    isInWishlist,

    orders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    requestReturn,

    notifications,
    unreadNotificationCount,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,

    toasts,
    showToast,
    dismissToast,

    user,
    isAuthenticated,
    isAdminAuthenticated,
    login,
    registerUser,
    logout,
    authenticateAdmin,
    lockAdmin,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    walletTransactions,
    addWalletMoney,
    switchRole,

    uploadFile,

    theme,
    toggleTheme,
    setTheme,

    isSidebarCollapsed,
    toggleSidebar,
    setIsSidebarCollapsed,
    isSidebarHovered,
    setIsSidebarHovered,
    isMobileMenuOpen,
    setIsMobileMenuOpen,

    currency,
    setCurrency,
    formatPrice,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
