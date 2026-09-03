export type Role = 'customer' | 'seller' | 'supplier' | 'admin';

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isCover?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface ReviewItem {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  images?: string[];
  helpfulCount: number;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  detailedDescription?: string;
  price: number; // In Rupees e.g. 399
  compareAtPrice: number; // Original strike-through price
  currency: string;
  categoryId: string;
  categoryName: string;
  collectionSlug?: string;
  tags: string[];
  badge?: string; // 'Best Seller' | 'Trending' | 'Handcrafted' | 'Flash Sale' | '50% OFF'
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  reviews?: ReviewItem[];
  faqs?: ProductFAQ[];
  specifications: Record<string, string>;
  artisanName?: string;
  artisanLocation?: string;
  artisanStory?: string;
  isHandcrafted: boolean;
  isDropship: boolean;
  isWinningProduct?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  stock: number;
  supplierId?: string;
  supplierName?: string;
  supplierCost?: number;
  profitMarginPercent?: number;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
  featured: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  variantName?: string;
  selectedColor?: string;
  selectedSize?: string;
  category: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface TrackingEvent {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
  supplierName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'cod' | 'netbanking';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  transactionId: string;
  courier: {
    name: string;
    trackingNumber: string;
    trackingUrl: string;
    estimatedDelivery: string;
  };
  trackingTimeline: TrackingEvent[];
  notes?: string;
  canCancel: boolean;
  canReturn: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'payment' | 'dropship' | 'security' | 'marketing' | 'system';
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'critical';
  link?: string;
}

export interface CouponItem {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiresAt: string;
}

export interface SupplierItem {
  id: string;
  name: string;
  rating: number;
  totalProducts: number;
  fulfillmentRate: number;
  avgShipDays: number;
  location: string;
  categories: string[];
  verified: boolean;
  contactEmail: string;
  avatar: string;
  minOrderQty: number;
}

export interface SourcingRequest {
  id: string;
  productName: string;
  category: string;
  targetPrice: number;
  quantity: number;
  notes: string;
  referenceUrl?: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  date: string;
  quotedPrice?: number;
  supplierName?: string;
  leadTimeDays?: number;
}

export interface DropshipImportRecord {
  id: string;
  sourceUrl: string;
  platform: 'AliExpress' | 'CJ Dropshipping' | 'Alibaba' | 'Amazon' | 'Custom CSV';
  importedAt: string;
  product: Partial<ProductItem>;
  supplierCost: number;
  targetPrice: number;
  status: 'draft' | 'published';
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  balanceAfter: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  merchantStatus?: 'none' | 'pending' | 'verified' | 'rejected';
  merchantApplicationId?: string;
  walletBalance: number;
  loyaltyPoints: number;
  tier: 'Silver' | 'Gold' | 'Diamond VIP';
  addresses: Address[];
  joinedDate: string;
  twoFactorEnabled: boolean;
  isAuthenticated?: boolean;
  isAdminVerified?: boolean;
  notificationPreferences: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
}
