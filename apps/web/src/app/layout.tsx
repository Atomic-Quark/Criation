import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { MainLayoutContainer } from "@/components/layout/MainLayoutContainer";
import { ToastContainer } from "@/components/ui/Toast";
import { RouteLoadingBar } from "@/components/layout/RouteLoadingBar";
import { Suspense } from "react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

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
    <html
      lang="en"
      className={`h-full scroll-smooth ${plusJakarta.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
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
      <body className="flex min-h-full flex-col bg-[#faf7f2] dark:bg-[#141210] text-[#241f1c] dark:text-[#f4ece1] font-sans antialiased pb-14 lg:pb-0 transition-colors duration-300 overflow-x-clip max-w-[100vw]">
        <StoreProvider>
          <Suspense fallback={null}>
            <RouteLoadingBar />
          </Suspense>
          <Suspense fallback={<div className="min-h-screen bg-[#faf7f2] dark:bg-[#141210]" />}>
            <MainLayoutContainer>{children}</MainLayoutContainer>
          </Suspense>
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
