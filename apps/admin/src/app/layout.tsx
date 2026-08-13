import type { Metadata } from "next";

import { appConfig } from "@/lib/config";

import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.appName,
  description: "Internal administration dashboard for Criation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
