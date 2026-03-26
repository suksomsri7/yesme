"use client";

import { useState } from "react";
import type { AIAgent } from "@/lib/types";
import { AI_MODELS } from "@/lib/types";
import { Check, Search } from "lucide-react";

interface BrainTabProps {
  agent: AIAgent;
  onUpdate: (updates: Partial<AIAgent>) => void;
}

export default function BrainTab({ agent, onUpdate }: BrainTabProps) {
  const [query, setQuery] = useState("");

  const filtered = AI_MODELS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.provider.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce(
    (acc, model) => {
      if (!acc[model.provider]) acc[model.provider] = [];
      acc[model.provider].push(model);
      return acc;
    },
    {} as Record<string, typeof filtered>
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          AI Model
        </h3>
        <p className="mt-1 text-xs text-muted/70">
          Choose the brain that powers this agent
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models..."
          className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-muted/50 focus:border-foreground"
        />
      </div>

      {Object.keys(grouped).length === 0 && (
        <p className="py-6 text-center text-xs text-muted">No models found</p>
      )}

      {Object.entries(grouped).map(([provider, models]) => (
        <div key={provider} className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            {provider}
          </span>
          <div className="flex flex-col gap-1.5">
            {models.map((model) => {
              const selected = agent.brain.model === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() =>
                    onUpdate({
                      brain: { model: model.id, provider: model.provider },
                    })
                  }
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                    selected
                      ? "border-foreground bg-foreground/5"
                      : "hover:border-foreground/20"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{model.name}</span>
                    <div className="flex items-center gap-3 text-[10px] text-muted">
                      <span>
                        Input{" "}
                        <span className="font-semibold text-foreground/70">
                          ${model.inputPrice}
                        </span>
                        /1M
                      </span>
                      <span>
                        Output{" "}
                        <span className="font-semibold text-foreground/70">
                          ${model.outputPrice}
                        </span>
                        /1M
                      </span>
                    </div>
                  </div>
                  {selected ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground">
                      <Check className="h-3 w-3 text-accent-foreground" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-border" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
