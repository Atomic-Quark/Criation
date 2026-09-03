"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useStore } from "@/context/StoreContext";

interface MainLayoutContainerProps {
  children: React.ReactNode;
}

export function MainLayoutContainer({ children }: MainLayoutContainerProps) {
  const { isSidebarHovered } = useStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div
        className={`flex-1 flex flex-col transition-[padding] duration-300 ease-in-out ${
          isSidebarHovered ? "md:pl-[250px]" : "md:pl-[72px]"
        }`}
      >
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
