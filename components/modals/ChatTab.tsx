"use client";

import type { AIAgent, ChannelConfig } from "@/lib/types";
import { CHANNEL_TYPES } from "@/lib/types";
import { Check } from "lucide-react";

interface ChatTabProps {
  agent: AIAgent;
  onUpdate: (updates: Partial<AIAgent>) => void;
}

export default function ChatTab({ agent, onUpdate }: ChatTabProps) {
  const currentChannel = agent.chat[0] ?? null;

  const selectChannel = (type: ChannelConfig["type"]) => {
    const channelType = CHANNEL_TYPES.find((c) => c.type === type);

    if (currentChannel?.type === type) return;

    const newChannel: ChannelConfig = {
      id: `ch-${Date.now()}`,
      type,
      name: channelType?.name || type,
      token: "",
      enabled: true,
    };
    onUpdate({ chat: [newChannel] });
  };

  const updateToken = (token: string) => {
    if (!currentChannel) return;
    onUpdate({ chat: [{ ...currentChannel, token }] });
  };

  const clearChannel = () => {
    onUpdate({ chat: [] });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Chat Channel
        </h3>
        <p className="mt-1 text-xs text-muted/70">
          Choose one messaging platform for this agent
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {CHANNEL_TYPES.map((ch) => {
          const isSelected = currentChannel?.type === ch.type;
          return (
            <button
              key={ch.type}
              onClick={() => selectChannel(ch.type)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                isSelected
                  ? "border-foreground bg-foreground/5"
                  : "hover:border-foreground/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: ch.color }}
                />
                <span className="text-sm font-medium">{ch.name}</span>
              </div>
              {isSelected ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                  <Check className="h-3 w-3 text-accent-foreground" />
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-border" />
              )}
            </button>
          );
        })}
      </div>

      {currentChannel && (
        <div className="flex flex-col gap-3 rounded-xl border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: CHANNEL_TYPES.find(
                    (c) => c.type === currentChannel.type
                  )?.color,
                }}
              />
              <span className="text-sm font-medium">{currentChannel.name}</span>
            </div>
            <button
              onClick={clearChannel}
              className="text-[10px] text-muted hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
          <input
            value={currentChannel.token}
            onChange={(e) => updateToken(e.target.value)}
            placeholder={`${currentChannel.name} Bot Token / API Key`}
            className="h-8 rounded-lg border bg-background px-3 text-xs outline-none transition-colors placeholder:text-muted/50 focus:border-foreground"
          />
        </div>
      )}
    </div>
  );
}
