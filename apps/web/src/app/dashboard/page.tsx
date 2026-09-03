"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    const isSuperadmin =
      user?.role === "admin" ||
      user?.email?.toLowerCase().trim() === "dks45000000@gmail.com";

    if (isSuperadmin) {
      router.replace("/admin");
    } else if (user?.role === "seller") {
      router.replace("/seller");
    } else {
      router.replace("/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Redirecting to your Dashboard...</p>
      </div>
    </div>
  );
}
