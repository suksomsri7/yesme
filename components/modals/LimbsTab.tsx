"use client";

import { useState } from "react";
import type { AIAgent } from "@/lib/types";
import { Check, Search, ExternalLink } from "lucide-react";

interface LimbsTabProps {
  agent: AIAgent;
  onUpdate: (updates: Partial<AIAgent>) => void;
}

export default function LimbsTab({ agent, onUpdate }: LimbsTabProps) {
  const [query, setQuery] = useState("");

  const selectPackage = (pkgId: string) => {
    const updated = agent.limbs.map((p) => ({
      ...p,
      enabled: p.id === pkgId,
    }));
    onUpdate({ limbs: updated });
  };

  const filtered = agent.limbs.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  const selected = agent.limbs.find((p) => p.enabled);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          OpenClaw Package
        </h3>
        <p className="mt-1 text-xs text-muted/70">
          Choose one tool package for this agent
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packages..."
          className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-muted/50 focus:border-foreground"
        />
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-xs text-muted">No packages found</p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((pkg) => (
          <div
            key={pkg.id}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
              pkg.enabled
                ? "border-foreground bg-foreground/5"
                : "hover:border-foreground/20"
            }`}
          >
            <button
              onClick={() => selectPackage(pkg.id)}
              className="flex flex-1 flex-col gap-0.5 text-left"
            >
              <span className="text-sm font-medium">{pkg.name}</span>
              <span className="text-xs text-muted">{pkg.description}</span>
            </button>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs font-medium text-muted">
                ${pkg.price}/mo
              </span>
              <a
                href={pkg.manualUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 items-center justify-center rounded-lg border text-muted hover:bg-background hover:text-foreground transition-colors"
                title="Manual"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
              <button onClick={() => selectPackage(pkg.id)}>
                {pkg.enabled ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                    <Check className="h-3 w-3 text-accent-foreground" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-border" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3">
          <span className="text-xs text-muted">
            Selected: {selected.name}
          </span>
          <span className="text-sm font-semibold">${selected.price}/mo</span>
        </div>
      )}
    </div>
  );
}
