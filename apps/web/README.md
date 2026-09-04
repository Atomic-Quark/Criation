# @criation/web

The customer-facing Criation artisan e-commerce storefront and edge API. Built with **Next.js 16.3.0** (App Router, Turbopack, React 19.2.3) and **Tailwind CSS v4**.

---

## Local Development

```bash
# From repository root
npm run dev:web     # Starts Next.js development server at http://localhost:3000
npm run build:web   # Compiles production bundle
npm run typecheck   # Runs TypeScript checks
```

---

## Key Modules & Directories

```
apps/web/src/
├── app/                  # Next.js App Router pages and API route handlers
│   ├── page.tsx          # Storefront homepage (artisan stories, dropship winners, hero)
│   ├── products/         # Catalog browse, category filters, and product detail showcase
│   ├── deals/            # Flash clearance with live countdown timer
│   ├── messages/         # Dedicated Artisan & Concierge live messaging hub
│   ├── cart/             # Shopping cart and drawer checkout flow
│   ├── wishlist/         # Saved artisan items with stock alerts
│   ├── account/          # Customer dashboard, device sessions, order tracking
│   ├── seller/           # Artisan onboarding wizard & KYC submission
│   ├── dropship/         # Dropship platform & profit margin calculator
│   ├── admin/            # Superadmin console (restricted to dks45000000@gmail.com)
│   ├── auth/             # Standalone login, registration, and account recovery pages
│   └── api/              # Secure Edge & Node.js API route handlers
│       ├── auth/         # Login, register, session APIs with sliding-window rate limiting
│       ├── admin/        # Superadmin merchant management and KYC controls
│       ├── seller/       # Merchant application submission with Indian GST/PAN validation
│       └── storage/      # File upload handler with magic-byte inspection
├── components/           # Reusable UI components
│   ├── layout/           # AppSidebar, Navbar, Footer, MobileNav
│   ├── products/         # ProductCard, ProductGrid, ImageGallery, Reviews
│   ├── cart/             # MiniCartDrawer, CouponBar, CartSummary
│   └── auth/             # GitHub-style multi-account switcher modal
├── context/              # React Context providers (StoreContext, ThemeProvider)
└── lib/                  # Core application libraries
    ├── auth/             # JWT, requireRole, rateLimit, and device session scanner
    └── db/               # MongoDB Mongoose connection and data models
```

---

## Styling & Design System

- **Artisanal Heritage Palette:**
  - Aged linen: `#faf7f2`
  - Roasted cacao / espresso: `#241f1c` / `#141210`
  - Terracotta clay: `#c25e3f`
  - Eucalyptus sage: `#56745f`
  - Antique brass: `#b58334`
- **Typography:** `Playfair Display` (serif) headlines & prices; `Plus Jakarta Sans` body & controls.
- **Studio Photography Classes:**
  - `.product-image-aesthetic`: Calibrated brightness, contrast, and saturation.
  - `.product-stage-backdrop`: Radial photo-studio stage.
  - `.product-sheen-overlay`: Top-down specular light sheen and inset micro-bezel ring.
  - `.product-card-luxury`: Warm reflection glow on hover.

---

## Security Architecture

- **Defense-in-Depth (`requireRole.ts`):** Sensitive route handlers independently re-verify JWT cryptographic signatures rather than relying on middleware headers alone.
- **Sliding-Window Rate Limiter (`rateLimit.ts`):** In-memory and Upstash-ready protection against brute-force and credential stuffing attacks on authentication and upload routes.
- **Single-Superadmin Guard:** Admin access strictly locked to `dks45000000@gmail.com`.
