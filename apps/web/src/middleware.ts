import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protected route paths
  const isAdminRoute = pathname.startsWith("/admin");
  const isSellerRoute = pathname.startsWith("/seller");
  const isSupplierRoute = pathname.startsWith("/supplier");
  const isAccountRoute = pathname.startsWith("/account");
  const isCheckoutRoute = pathname.startsWith("/checkout");

  // If not a protected route, continue
  if (!isAdminRoute && !isSellerRoute && !isSupplierRoute && !isAccountRoute && !isCheckoutRoute) {
    return NextResponse.next();
  }

  // 1. Extract Token from Cookie or Authorization header
  const token =
    req.cookies.get(AUTH_COOKIE_NAME)?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    // API routes return 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }
    // Page routes redirect to login
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Verify Token
  const session = await verifyTokenEdge(token);
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Session expired or invalid. Please sign in again." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isSellerApplyRoute = pathname.startsWith("/seller/apply") || pathname.startsWith("/seller/register");

  // 3. Role-Based Access Control (RBAC)
  if (isAdminRoute) {
    // SECURITY: Superadmin is strictly isolated to dks45000000@gmail.com
    if (session.role !== "admin" || session.email !== "dks45000000@gmail.com") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Superadmin access strictly restricted." },
          { status: 403 }
        );
      }
      const homeUrl = new URL("/", req.url);
      homeUrl.searchParams.set("error", "access_denied");
      return NextResponse.redirect(homeUrl);
    }
  }

  // Seller operations hub requires verified seller role (or superadmin). Seller apply route is open to all logged in users.
  if (isSellerRoute && !isSellerApplyRoute) {
    const isSuperadmin = session.role === "admin" && session.email === "dks45000000@gmail.com";
    if (session.role !== "seller" && !isSuperadmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Verified Merchant Hub access required." },
          { status: 403 }
        );
      }
      const applyUrl = new URL("/seller/apply", req.url);
      return NextResponse.redirect(applyUrl);
    }
  }

  if (isSupplierRoute) {
    if (session.role !== "supplier" && session.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Wholesale Supplier access required." },
          { status: 403 }
        );
      }
      const homeUrl = new URL("/", req.url);
      homeUrl.searchParams.set("error", "supplier_required");
      return NextResponse.redirect(homeUrl);
    }
  }

  // Session authorized, inject user metadata into request headers for downstream handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-user-email", session.email);
  requestHeaders.set("x-user-role", session.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/supplier/:path*",
    "/account/:path*",
    "/checkout/:path*",
  ],
};
