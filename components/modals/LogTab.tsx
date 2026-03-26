"use client";

import type { AIAgent } from "@/lib/types";

interface LogTabProps {
  agent: AIAgent;
}

const MOCK_LOGS = [
  { id: 1, time: "2026-03-26 10:31:02", level: "info", message: "Agent initialized" },
  { id: 2, time: "2026-03-26 10:31:03", level: "info", message: "Brain loaded: GPT-4o" },
  { id: 3, time: "2026-03-26 10:31:04", level: "info", message: "Channel connected: Telegram" },
  { id: 4, time: "2026-03-26 10:31:10", level: "info", message: "Received message from user @demo_user" },
  { id: 5, time: "2026-03-26 10:31:11", level: "info", message: "Processing with GPT-4o..." },
  { id: 6, time: "2026-03-26 10:31:13", level: "success", message: "Response sent successfully" },
  { id: 7, time: "2026-03-26 10:32:05", level: "warn", message: "Rate limit approaching (80%)" },
  { id: 8, time: "2026-03-26 10:33:00", level: "info", message: "Received message from user @test_user" },
  { id: 9, time: "2026-03-26 10:33:02", level: "error", message: "Tool execution failed: timeout after 30s" },
  { id: 10, time: "2026-03-26 10:33:03", level: "info", message: "Retrying with fallback..." },
  { id: 11, time: "2026-03-26 10:33:05", level: "success", message: "Fallback response sent" },
];

const LEVEL_STYLES: Record<string, string> = {
  info: "text-muted",
  success: "text-emerald-600",
  warn: "text-amber-600",
  error: "text-red-500",
};

const LEVEL_DOT: Record<string, string> = {
  info: "bg-muted",
  success: "bg-emerald-500",
  warn: "bg-amber-500",
  error: "bg-red-500",
};

export default function LogTab({ agent }: LogTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Activity Log
        </h3>
        <p className="mt-1 text-xs text-muted/70">
          Recent activity for {agent.name}
        </p>
      </div>

      <div className="flex flex-col gap-0.5 rounded-xl border bg-background p-1 font-mono">
        {MOCK_LOGS.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-2 rounded-lg px-3 py-1.5 hover:bg-card transition-colors"
          >
            <div
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${LEVEL_DOT[log.level]}`}
            />
            <span className="shrink-0 text-[10px] text-muted/60">
              {log.time.split(" ")[1]}
            </span>
            <span className={`text-[11px] ${LEVEL_STYLES[log.level]}`}>
              {log.message}
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-muted/50">
        Showing mock data — connect to backend for live logs
      </p>
    </div>
  );
}
