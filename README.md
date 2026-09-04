# Criation · Artisan Heritage & Global Dropship Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-ef4444?style=flat&logo=turborepo)](https://turbo.build/repo)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

Criation is an omnichannel commerce ecosystem uniting authentic **Indian Handcrafted Heritage** (crochet artistry, designer clay diyas, royal pearl vases, and festive decor crafted by rural master artisans) with a **Global Dropshipping Hub** (vetted suppliers, high-margin products, and automated fulfillment).

The platform is developed as a monorepo using **npm workspaces + Turborepo**, sharing types, utilities, design tokens, validation schemas, and configurations across the customer web store, admin operations console, mobile application, and backend services.

---

## What's New & Recent Updates

### 1. Artisanal Vintage UI/UX Design System
- **Earthy Artisanal Palette:** Replaced harsh digital grays with warm, calm vintage tones:
  - **Light Mode:** Aged linen & parchment (`#faf7f2`), deep roasted cacao typography (`#241f1c`), and warm stone borders (`#e8e0d4`).
  - **Dark Mode:** Roasted espresso teakwood (`#141210`), antique candlelight ivory (`#f4ece1`), and dark umber borders (`#352f29`).
  - **Heritage Accents:** Terracotta clay (`#c25e3f`), eucalyptus sage (`#56745f`), and antique kansa brass (`#b58334`).
- **Editorial Typography Pairing:** Integrated **Playfair Display** (`font-serif`) for timeless craft headings and price tags, paired with **Plus Jakarta Sans** (`font-sans`) for clean, snugly fitted body controls.
- **Velvet-Smooth Interactions:** Custom `cubic-bezier(0.25, 1, 0.5, 1)` easing transitions, eliminating harsh jumps across theme toggling and layout animations.

### 2. Studio Lighting & Aesthetic Product Photography Grading
- **Calibrated Tonal Grading (`.product-image-aesthetic`):** Optimized brightness (`1.03`), micro-contrast (`1.06`), and natural saturation (`1.07`) to highlight handmade textile fibers, pearls, and metallic lusters.
- **Studio Stage Backdrop (`.product-stage-backdrop`):** Seamless radial photo-studio lighting backdrop behind product cards and showcase frames.
- **Top-Down Specular Sheen (`.product-sheen-overlay`):** Inset micro-bezel stroke ring and diffuse lighting sheen giving the appearance of high-end museum or boutique glass displays.
- **Ambient Light Halos:** Soft radial light auras behind primary product showcases.

### 3. Dedicated Artisan & Concierge Messages Hub (`/messages`)
- **Resolved Sidebar Ambiguity:** Separated **Flash Deals** (`/deals`, `Flame` icon, `HOT` badge) from **Messages** (`/messages`, `MessageSquare` icon, `2` unread badge).
- **Direct Live Communication:** Interactive chat stream with master craftswomen (e.g., *Meera Devi* from Jaipur Blue Pottery Guild, *Radha Sharma* from Varanasi Crochet Guild) and *Criation Care & Logistics*.
- **Features:** Order references, message timestamps, delivery status checks, quick action reply pills (*"Request finished photos"*, *"Inquire dispatch date"*), and real-time message sending.

### 4. Defense-in-Depth Security & Framework Hardening
- **Next.js 16.3.0 & React 19.2.3:** Fully patched against `CVE-2025-29927`, `CVE-2026-45109`, and May 2026 prefetch advisories.
- **Handler-Level Re-Verification (`requireRole`):** Added independent cryptographic JWT verification in [`apps/web/src/lib/auth/requireRole.ts`](apps/web/src/lib/auth/requireRole.ts). Does not rely on middleware headers alone, preventing edge bypasses.
- **Single-Superadmin Lockdown:** Access to the superadmin console and operations is cryptographically enforced to the single authorized email (`dks45000000@gmail.com`).
- **Secret Rotation:** Rotated `JWT_SECRET` and initialized `PAYMENT_HMAC_SECRET` using high-entropy 48-byte cryptographically secure keys.
- **Live Sliding-Window Rate Limiting:** Implemented [`apps/web/src/lib/auth/rateLimit.ts`](apps/web/src/lib/auth/rateLimit.ts) actively protecting `/api/auth/login`, `/api/auth/register`, and `/api/storage/upload` with RFC 429 headers.

### 5. Multi-Account Device Tracking & Cart Isolation
- **GitHub-Style Account Switcher:** Multi-account modal displaying active/remembered accounts, device platforms, client IP logging, and instant one-click switching.
- **Per-Account Cart Isolation:** Fixed cross-account cart pollution; items added to one user's cart are strictly isolated to their account session and MongoDB cart store.

---

## Requirements

| Tool | Version |
| ---- | ------- |
| Node | >= 20.19.0 |
| npm | >= 10 |

Mobile development additionally requires the [Expo Go](https://expo.dev/go) app or an Android/iOS simulator.

---

## Getting Started

```bash
# 1. Clone repository
git clone <repo-url> criation
cd criation

# 2. Install monorepo dependencies (from repo root)
npm install

# 3. Configure environment variables
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local

# 4. Start local development servers
npm run dev:web      # Customer Website & API -> http://localhost:3000
npm run dev:admin    # Admin Operations Console -> http://localhost:3001
npm run dev:backend  # Express API -> http://localhost:4000
npm run dev:mobile   # Expo / React Native dev server
```

> **Important:** Always execute `npm install` from the **repository root**. Running `npm install` inside an individual workspace creates nested `node_modules` that break monorepo hoisting and Metro bundler resolution.

---

## Repository Architecture

```
criation/
├── apps/
│   ├── web/          @criation/web      Next.js 16.3 customer storefront & API (:3000)
│   ├── mobile/       @criation/mobile   Expo / React Native mobile application
│   └── admin/        @criation/admin    Next.js 16.3 admin operations console  (:3001)
│
├── backend/
│   └── api/          @criation/backend  Express 5 API & background workers     (:4000)
│
├── packages/
│   ├── ui/           @criation/ui         Design tokens + web and native components
│   ├── types/        @criation/types      Shared interfaces, enums, API data models
│   ├── utils/        @criation/utils      Currency formatting, math, string helpers
│   ├── api/          @criation/api        Typed API client shared across applications
│   ├── validation/   @criation/validation Zod schemas for forms and API requests
│   └── config/       @criation/config     TypeScript, ESLint, and runtime configs
│
├── docs/             Architectural roadmaps, security audits, and guidelines
├── .env.example      Documented environment variable template
├── package.json      Workspace orchestration and monorepo scripts
├── tsconfig.json     Root TypeScript configuration
└── turbo.json        Turborepo task pipeline and caching rules
```

---

## Key Pages & Portals

| Route | Purpose | Description |
| ----- | ------- | ----------- |
| `/` | Storefront Home | Hero artisan spotlight, collections, flash deals, dropship winners |
| `/products` | Catalog & Shop | Filterable by craft type, price, artisan region, and reviews |
| `/products/[id]` | Product Detail | Studio lighting showcase, zoom gallery, buy box, bundled savings |
| `/deals` | Flash Clearance | Live countdown timer, up to 50% discount deals |
| `/messages` | Messages Hub | Direct two-way messaging with rural craftswomen and support |
| `/cart` / Drawer | Cart & Checkout | Free shipping progress meter, coupon engine, tax calculation |
| `/wishlist` | Saved Items | Real-time stock alerts, shareable wishlist link, one-click move to bag |
| `/account` | User Account | Order tracking, saved addresses, wallet balance, device sessions |
| `/seller` | Merchant Portal | Artisan onboarding wizard, craft submission, KYC verification |
| `/dropship` | Dropship Platform | Profit margin calculator, verified suppliers, 1-click import |
| `/admin` | Operations Center | KYC review, order fulfillment SLA monitoring, platform analytics |
| `/support` | Help Center | 24/7 FAQ accordion, ticket creation, doorstep return instructions |

---

## Scripts & Commands

Every command runs from the repository root via Turborepo:

| Command | What It Does |
| ------- | ------------ |
| `npm run dev` | Starts all applications in parallel |
| `npm run dev:web` | Starts the Next.js web application on port 3000 |
| `npm run dev:admin` | Starts the admin console on port 3001 |
| `npm run dev:backend` | Starts the Express API on port 4000 with `tsx watch` |
| `npm run dev:mobile` | Starts the Expo development server |
| `npm run build` | Builds every package and application for production |
| `npm run build:web` | Builds only the `@criation/web` application |
| `npm run typecheck` | Runs `tsc --noEmit` across all workspaces |
| `npm run lint` | Runs ESLint across all workspaces |
| `npm run format:check` | Checks formatting with Prettier |
| `npm run clean` | Purges `.next`, `dist`, and build caches across the monorepo |

---

## Security & Compliance Architecture

- **Statutory Indian E-Commerce Compliance:** Strict GSTIN format validation, PAN verification, and IFSC validation for seller onboarding.
- **DPDP Act (Digital Personal Data Protection):** Strict purpose-bound data collection, consent tracking, and localized server storage.
- **Defense-in-Depth Authorization:** Edge middleware coupled with handler-level cryptographic token signature re-verification (`requireRole`).
- **Brute-Force & Bot Defense:** Sliding-window rate limiting on all authentication and upload endpoints.
- **File Upload Hardening:** Strict magic-byte (file signature) inspection preventing executable or script uploads under disguised MIME types.

---

## License

MIT License · Built with care for Indian Artisans and Global Commerce.
