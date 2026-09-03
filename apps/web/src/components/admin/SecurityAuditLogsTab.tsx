"use client";

import React from "react";

interface SecurityAuditLogsTabProps {
  logs: Array<{ event: string; time: string }>;
}

export function SecurityAuditLogsTab({ logs }: SecurityAuditLogsTabProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
        Live Infrastructure & Security Audit Logs
      </h3>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {logs.map((l, i) => (
          <div key={i} className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{l.event}</span>
            </div>
            <span className="text-zinc-400 dark:text-zinc-400 text-[10px] font-mono">{l.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
