"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AppSidebar } from "./AppSidebar";
import { MobileBottomBar } from "./MobileBottomBar";
import { MiniCartDrawer } from "../cart/MiniCartDrawer";
import { AIChatWidget } from "../ai/AIChatWidget";
import { MultiAccountSignOutModal } from "../auth/MultiAccountSignOutModal";
import { useStore } from "@/context/StoreContext";

interface MainLayoutContainerProps {
  children: React.ReactNode;
}

export function MainLayoutContainer({ children }: MainLayoutContainerProps) {
  const pathname = usePathname();
  const { isSidebarHovered } = useStore();
  const isAuthRoute = Boolean(pathname?.startsWith("/auth"));

  if (isAuthRoute) {
    return (
      <main className="min-h-screen w-full">
        {children}
        <MultiAccountSignOutModal />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar with tailored alignment to floating sidebar */}
        <div
          className={`sticky top-0 z-40 transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isSidebarHovered ? "md:pl-[272px]" : "md:pl-[100px]"
          } md:pr-4 md:pt-4`}
        >
          {/* Ceiling mask so scrolled page content never peeks through the top 16px floating gap */}
          <div className="hidden md:block absolute top-0 left-0 right-0 h-4 bg-[#faf7f2] dark:bg-[#141210] pointer-events-none" />
          <Navbar />
        </div>

        {/* Main page content and footer */}
        <div
          className={`flex-1 flex flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isSidebarHovered ? "md:pl-[272px]" : "md:pl-[100px]"
          } md:pr-4`}
        >
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
      </div>
      <MiniCartDrawer />
      <AIChatWidget />
      <MobileBottomBar />
      <MultiAccountSignOutModal />
    </div>
  );
}
