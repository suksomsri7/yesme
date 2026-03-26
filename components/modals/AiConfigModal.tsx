"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { X, Brain, Wrench, MessageSquare, ScrollText, Pencil } from "lucide-react";
import BrainTab from "./BrainTab";
import LimbsTab from "./LimbsTab";
import ChatTab from "./ChatTab";
import LogTab from "./LogTab";

const TABS = [
  { id: "brain" as const, label: "Brain", icon: Brain },
  { id: "limbs" as const, label: "Limbs", icon: Wrench },
  { id: "chat" as const, label: "Chat", icon: MessageSquare },
  { id: "log" as const, label: "Log", icon: ScrollText },
];

type TabId = "brain" | "limbs" | "chat" | "log";

export default function AiConfigModal() {
  const {
    workspaces,
    activeWorkspaceId,
    selectedAgentId,
    showConfigModal,
    setShowConfigModal,
    updateAgent,
    removeAgent,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>("brain");
  const [isEditingName, setIsEditingName] = useState(false);

  if (!showConfigModal || !activeWorkspaceId || !selectedAgentId) return null;

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const agent = workspace?.agents.find((a) => a.id === selectedAgentId);

  if (!agent || !workspace) return null;

  const handleClose = () => {
    setShowConfigModal(false);
    setIsEditingName(false);
  };

  const handleDelete = () => {
    removeAgent(activeWorkspaceId, selectedAgentId);
    setShowConfigModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-card shadow-xl md:h-[560px] md:max-w-lg md:rounded-2xl md:border">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <input
                autoFocus
                value={agent.name}
                onChange={(e) =>
                  updateAgent(activeWorkspaceId, selectedAgentId, {
                    name: e.target.value,
                  })
                }
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false);
                }}
                className="h-7 rounded-md border bg-background px-2 text-sm font-semibold outline-none focus:border-foreground"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="group flex items-center gap-1.5 rounded-md px-1 py-0.5 hover:bg-background transition-colors"
              >
                <span className="text-sm font-semibold">{agent.name}</span>
                <Pencil className="h-3 w-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b px-3 md:px-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors md:px-4 ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "brain" && (
            <BrainTab
              agent={agent}
              onUpdate={(updates) =>
                updateAgent(activeWorkspaceId, selectedAgentId, updates)
              }
            />
          )}
          {activeTab === "limbs" && (
            <LimbsTab
              agent={agent}
              onUpdate={(updates) =>
                updateAgent(activeWorkspaceId, selectedAgentId, updates)
              }
            />
          )}
          {activeTab === "chat" && (
            <ChatTab
              agent={agent}
              onUpdate={(updates) =>
                updateAgent(activeWorkspaceId, selectedAgentId, updates)
              }
            />
          )}
          {activeTab === "log" && <LogTab agent={agent} />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-5 py-3">
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            Delete agent
          </button>
          <button
            onClick={handleClose}
            className="flex h-8 items-center rounded-lg bg-foreground px-4 text-xs font-medium text-accent-foreground transition-all hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
