import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { MainLayoutContainer } from "@/components/layout/MainLayoutContainer";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { ToastContainer } from "@/components/ui/Toast";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { RouteLoadingBar } from "@/components/layout/RouteLoadingBar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Criation | Authentic Indian Handcrafted & Global Dropshipping Platform",
  description:
    "Discover exquisite handmade crochet keychains, festive designer diyas, pearl flower vases, Laddu Gopal poshak, and trending winning dropshipping products with express delivery.",
  keywords: [
    "handcrafted crafts",
    "crochet keychains",
    "designer diyas",
    "pearl flower vase",
    "laddu gopal poshak",
    "thalposh",
    "dropshipping india",
    "winning dropship products",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('criation_theme_v1');
                if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch(e){}
            })()`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-14 lg:pb-0 transition-colors duration-200">
        <StoreProvider>
          <Suspense fallback={null}>
            <RouteLoadingBar />
          </Suspense>
          <AppSidebar />
          <MainLayoutContainer>{children}</MainLayoutContainer>
          <MiniCartDrawer />
          <ToastContainer />
          <AIChatWidget />
          <MobileBottomBar />
        </StoreProvider>
      </body>
    </html>
  );
}
