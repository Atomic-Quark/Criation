# Criation Platform: Secure Production Development Plan & Architectural Roadmap

**Document Status:** Approved Architecture & Implementation Blueprint  
**Target Target Stack:** Next.js 16.3.0, React 19.2.3, Turborepo, MongoDB/Mongoose, Tailwind CSS 4, Razorpay/Cashfree  
**Date:** September 2026  
**Reference Documents:**  
- `docs/audit-report.html`  
- `docs/Criation-Errors-and-Problems.pdf` (34 Findings)  
- `docs/Criation-UI-UX-Review.pdf` (38 Findings)  

---

## 1. Executive Summary & Current Repository State

Criation is an omnichannel marketplace uniting authentic **Indian Handcrafted Heritage** (crochet art, brass diyas, pearl vases, festive decor) with a **Global Dropshipping Hub**. The codebase is organized as an npm workspaces monorepo orchestrated by Turborepo across four applications (`@criation/web`, `@criation/admin`, `@criation/mobile`, `@criation/backend`) and six shared packages (`types`, `ui`, `utils`, `api`, `validation`, `config`).

### The Transition Phase: Prototype to Hardened Production
The platform boasts exceptional visual design, a bespoke WebGL ocean shader, a dark-mode theme engine, and 30+ fully drafted frontend routes. However, until recently, the commerce engine ran client-side: cart, orders, and wallet balance lived in `localStorage`, and checkout completed using `setTimeout` order synthesis.

Over recent commits on branch `CT04`, critical security work began:
- Edge JWT middleware (`middleware.ts`) was added to guard privileged paths.
- Security response headers were integrated into `next.config.ts`.
- Image optimizer SSRF vectors were closed.
- The admin seed endpoint was locked behind `x-seed-secret`.
- File uploads were secured with magic-byte (file signature) inspection and MIME whitelisting.
- Server-side price calculation and HMAC payment intent routes were established.

This plan details the exact path to make the platform **tamper-proof, fully automated, legally compliant under Indian e-commerce & DPDP laws, and transaction-ready**.

---

## 2. Immediate Action: Next.js Version Audit & Defense-in-Depth Authorization

### 2.1 Next.js Version Verification
- **Status in `apps/web/package.json`:** `"next": "16.3.0"`, `"react": "19.2.3"`.
- **Status in `apps/admin/package.json`:** `"next": "16.3.0"`, `"react": "19.2.3"`.
- **Finding:** The monorepo is currently on **Next.js 16.3.0**, which is already patched against:
  - `CVE-2025-29927` (internal middleware header bypass).
  - May 2026 advisories (`Next.js 16.2.6` / `15.5.18` `.rsc` segment prefetch bypass).
  - `CVE-2026-45109` (Turbopack middleware execution bypass).

### 2.2 The Non-Negotiable Rule: Defense-in-Depth
Regardless of framework patches, **Next.js middleware must NEVER be the sole authorization gatekeeper**. If an edge routing glitch, misconfigured matcher, or prefetch bypass occurs, unauthenticated requests must still fail at the data and handler layers.

**Implementation Standard:**
Create a unified handler-level guard `apps/web/src/lib/auth/guard.ts`:
```ts
import { NextRequest } from "next/server";
import { verifyToken, AUTH_COOKIE_NAME, JWTPayload } from "./jwt";
import { Role } from "@/types/store";

export interface AuthContext {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export function assertAuthenticated(req: NextRequest): AuthContext {
  const token =
    req.cookies.get(AUTH_COOKIE_NAME)?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.headers.get("x-user-id"); // Injected by middleware if verified

  const session = token ? verifyToken(token) : null;
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function assertRole(req: NextRequest, allowedRoles: Role[]): AuthContext {
  const session = assertAuthenticated(req);
  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
```
Every API route handling sensitive mutations (`/api/orders`, `/api/products`, `/api/storage/upload`, `/api/checkout/*`) and every server-rendered console must invoke `assertRole()` directly, independently of whether middleware ran.

---

## 3. Phase-by-Phase Production Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PRODUCTION EXECUTION PHASES                           │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────────┤
│   PHASE 1    │   PHASE 2    │   PHASE 3    │   PHASE 4    │     PHASE 5     │
│ Payments &   │ Data Layer & │ Reliability, │ UI/UX Polish │ CI/CD, Tests &  │
│ DPDP India   │ Currency     │ Observability│ & Animation  │ Platform        │
│ Compliance   │ Unification  │ & Storage    │ Performance  │ Consolidation   │
└──────────────┴──────────────┴──────────────┴──────────────┴─────────────────┘
```

---

### Phase 1: Live Payment Gateway, Webhook Idempotency & DPDP Compliance

#### 1.1 Live Payment Gateway Integration (Razorpay / Cashfree)
1. **Frontend-to-Backend Order Initiation:**
   - In `apps/web/src/app/checkout/page.tsx`, remove the mock `setTimeout` in `handlePlaceOrder()`.
   - Send order payload (items, addresses, delivery speed) to `POST /api/orders`. The server calculates the exact subtotal, shipping, and GST based on database records.
   - The server creates a record with `paymentStatus: "pending"` and returns the verified `orderNumber`.
2. **Gateway Intent Creation (`POST /api/checkout/create-payment-intent`):**
   - Initiates an official gateway order with Razorpay/Cashfree using API keys stored in server environment variables.
   - Returns `gatewayOrderId`, `amount`, and a server-side HMAC SHA-256 signature to the client.
3. **Client SDK Invocation:**
   - Mounts the Razorpay Standard Checkout modal or Cashfree drop-in component.
   - On completion, sends `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to `POST /api/checkout/verify-payment`.
4. **Webhook Architecture & Idempotency:**
   - Create `POST /api/webhooks/razorpay`.
   - Verify signatures using a dedicated `RAZORPAY_WEBHOOK_SECRET` (distinct from the JWT secret).
   - Implement an **idempotent event store** in MongoDB (`WebhookEvent` collection):
     ```ts
     const eventId = req.headers.get("x-razorpay-event-id");
     const alreadyProcessed = await WebhookEvent.findOne({ eventId });
     if (alreadyProcessed) {
       return NextResponse.json({ status: "already_processed" });
     }
     ```
   - Only update order state to `paid` and decrement stock once per verified event.

#### 1.2 India DPDP Act (Digital Personal Data Protection Act) Compliance
India's DPDP regulations mandate strict user privacy, explicit consent, breach notification, and data fiduciary responsibilities:
1. **Notice & Consent:**
   - At `auth/register/page.tsx`, add an un-checked explicit consent checkbox linking to the updated Privacy Policy: *"I consent to Criation processing my phone, delivery address, and order history for fulfillment."*
2. **Data Principal Rights (Access & Erasure):**
   - Implement `GET /api/account/export-data` returning all stored addresses, orders, and wallet ledger entries in JSON/PDF.
   - Implement `POST /api/account/delete-request` allowing customers to initiate account anonymization/deletion.
3. **Data Minimization & Breach Protocol:**
   - Encrypt customer phone numbers and PII at rest where possible.
   - Document a 6-hour CERT-In / Data Protection Board security incident disclosure process.
   - Nominate a Grievance Redressal Officer published on `/legal/privacy` and `/support`.

#### 1.3 GST & Indian Tax Invoicing Compliance
- Replace the flat 5% tax assumption in `StoreContext.tsx` and `generateInvoice.ts`.
- Store HSN codes per category (e.g., `5705` for crochet home mats, `6912`/`6913` for clay diyas/terracotta, `7117` for imitation dropship jewellery).
- Calculate tax based on the delivery state:
  - **Intra-State** (e.g., Seller in Haryana ➔ Customer in Haryana): Split into **CGST + SGST**.
  - **Inter-State** (e.g., Seller in Haryana ➔ Customer in Maharashtra): Apply **IGST**.
- Generate serial sequential tax invoice numbers per financial year (e.g., `CR/26-27/0001`).

---

### Phase 2: Currency Unification & Immutable Wallet Ledger

#### 2.1 Currency Unification (Integer Paise Everywhere)
- **Problem:** `packages/types/src/product.ts` specifies prices in minor units (paise: `129900` for ₹1,299.00), whereas `apps/web/src/types/store.ts` defined price as whole rupees (`399`).
- **Solution:**
  - Standardize all models (`Product`, `Order`, `CartItem`, `WalletTransaction`) on integer paise.
  - Money math is strictly performed as integers, eliminating floating-point rounding errors (`0.1 + 0.2 !== 0.3`).
  - Formatting occurs exclusively at the edge presentation layer via `@criation/utils` `formatPrice(amountInPaise)`.

#### 2.2 Immutable Wallet Ledger
- Convert `user.walletBalance` from an editable scalar into an append-only transaction ledger:
```ts
// Mongoose WalletLedger Schema
const WalletLedgerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  amount: { type: Number, required: true }, // positive = credit, negative = debit
  balanceAfter: { type: Number, required: true },
  type: { type: String, enum: ["welcome_bonus", "deposit", "purchase_debit", "order_refund"], required: true },
  referenceId: { type: String, required: true }, // OrderNumber or GatewayPaymentId
  createdAt: { type: Date, default: Date.now }
});
```
- Deductions and credits must run inside MongoDB transactions (`session.withTransaction`) to guarantee ACID properties during simultaneous checkouts.

---

### Phase 3: Infrastructure, Storage & Reliability

#### 3.1 Cloud Object Storage (S3 / Cloudflare R2 / Cloudinary)
- Local disk writes in `apps/web/src/app/api/storage/upload/route.ts` write to `process.cwd()/public/uploads`, which fail on ephemeral serverless platforms (Vercel, AWS ECS, Netlify).
- Implement presigned upload URLs:
  1. Client calls `POST /api/storage/presigned-url` with file metadata.
  2. Server verifies authentication and issues a signed PUT URL for AWS S3 or Cloudflare R2.
  3. Client uploads directly to the object store; the file never passes through the application server.

#### 3.2 Distributed Rate Limiting & Bot Protection
- Install `@upstash/ratelimit` and `@upstash/redis`.
- Enforce sliding window limits:
  - `POST /api/auth/login`: 5 attempts per 15 minutes per IP.
  - `POST /api/auth/register`: 3 accounts per hour per IP.
  - `POST /api/checkout/create-payment-intent`: 10 intents per 10 minutes.
  - `POST /api/storage/upload`: 10 uploads per hour.

#### 3.3 Observability & Automated Backups
- Integrate Sentry for error capturing in Next.js Server Components, API routes, and Client UI.
- Configure daily automated MongoDB Atlas snapshots with quarterly restoration drill documentation.

---

### Phase 4: UI/UX, WebGL Optimization & Accessibility

#### 4.1 Taming the WebGL Ocean Horizon (`NavbarOceanCanvas.tsx`)
1. **Tab Inactivity Optimization:** Listen to `visibilitychange` and halt `requestAnimationFrame` when the user switches tabs.
2. **Motion Sensitivity:** Check `window.matchMedia("(prefers-reduced-motion: reduce)")`. When active, terminate the WebGL context and render the CSS backdrop gradient.
3. **Frame Throttling:** Cap frame delivery to 30 FPS on high-DPI and mobile displays to preserve battery life and eliminate scroll jank.

#### 4.2 Accessibility & Typography
1. **Typography Rescaling:** Shift body baseline from `text-xs` (12px) to 16px (`text-base`), with secondary text at 14px (`text-sm`), and badges at 12px.
2. **Accessible Modals:** Convert `MiniCartDrawer`, `NotificationCenter`, and review modals into accessible dialogs with focus trapping and `Escape` key listeners.
3. **Screen Reader Feedback:** Equip `Toast.tsx` with `role="status"` and `aria-live="polite"`.

#### 4.3 Authenticity & Elimination of Fake Urgency
1. Replace the cycling 14-hour countdown clock with scheduled festival windows (Diwali, Karwa Chauth, Navratri).
2. Connect pincode delivery estimation to real logistics delivery timelines based on courier zone mapping.

---

### Phase 5: Testing, CI/CD & Monorepo Consolidation

#### 5.1 Comprehensive Test Suite
- **Unit & Integration Tests (Vitest):**
  - Pricing calculation, coupon thresholds, and GST calculations.
  - HMAC payment signature verification and token generation.
  - Wallet balance atomic decrement routines.
- **End-to-End Tests (Playwright):**
  - Guest visits home ➔ searches product ➔ adds to cart ➔ registers ➔ initiates checkout ➔ verifies order creation.

#### 5.2 CI Pipeline (`.github/workflows/ci.yml`)
Configure GitHub Actions to execute on all pull requests:
```yaml
name: Criation Verification Pipeline
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run check # lint + typecheck + prettier check
      - run: npm run test  # vitest unit suite
      - run: npx playwright test
      - run: npm audit --audit-level=high --workspaces
```

#### 5.3 Multi-Platform Consolidation
- **Retire Orphaned `backend/api` Express Service:** Migrate any remaining business logic into `apps/web/src/app/api`.
- **Connect `@criation/api` to Next.js Routes:** Ensure `apps/mobile` (Expo) and `apps/admin` communicate with the unified MongoDB-backed API endpoints.

---

## 4. Execution Matrix & Priority Milestones

| Target | Milestone | Key Deliverables | Risk Level |
| :---: | :--- | :--- | :---: |
| **Week 1** | **Defense-in-Depth & Auth Closure** | Add `guard.ts` role checks to all API routes; convert guest default; add input autocomplete. | High |
| **Week 1-2** | **Live Gateway & Order Wiring** | Connect checkout UI to `/api/orders` & Razorpay SDK; implement idempotent webhook handler. | High |
| **Week 2** | **DPDP & GST Compliance** | Consent flows, account data export/delete, HSN codes, and CGST/SGST/IGST tax splits. | Med |
| **Week 2-3** | **Currency & Wallet Ledger** | Integer paise migration across all models; append-only wallet transaction schema. | Med |
| **Week 3** | **Storage & Rate Limiting** | S3/Cloudflare R2 presigned URLs; Upstash Redis rate limiters on auth & checkout. | Med |
| **Week 3-4** | **Testing & CI Pipeline** | Vitest suite for commerce logic; Playwright E2E; GitHub Actions quality gate. | Low |
| **Week 4** | **UI/UX & WebGL Performance** | WebGL tab pause & reduced motion; 16px typography rebase; real courier delivery estimation. | Low |

---

*This blueprint establishes the technical criteria required for Criation to launch as a secure, legally compliant, and commercially viable enterprise e-commerce platform.*
