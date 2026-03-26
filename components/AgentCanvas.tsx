"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Plus, Bot, Brain, Wrench, MessageSquare } from "lucide-react";

function AgentFace({ isComplete, isOnline }: { isComplete: boolean; isOnline: boolean }) {
  if (!isComplete) {
    return (
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <rect width="64" height="64" rx="16" fill="#d4d4d4" />
        <circle cx="22" cy="26" r="3.5" fill="#a3a3a3" />
        <circle cx="42" cy="26" r="3.5" fill="#a3a3a3" />
        <path d="M20 42 Q32 36 44 42" stroke="#a3a3a3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (!isOnline) {
    return (
      <svg viewBox="0 0 64 64" className="h-full w-full">
        <rect width="64" height="64" rx="16" fill="#171717" />
        <circle cx="22" cy="26" r="3.5" fill="#fff" />
        <circle cx="42" cy="26" r="3.5" fill="#fff" />
        <path d="M20 38 Q32 46 44 38" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <rect width="64" height="64" rx="16" fill="#2563eb" />
      <circle cx="22" cy="26" r="3.5" fill="#fff" />
      <circle cx="42" cy="26" r="3.5" fill="#fff" />
      <path d="M20 38 Q32 46 44 38" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function AgentCanvas() {
  const {
    workspaces,
    activeWorkspaceId,
    addAgent,
    selectAgent,
    setShowConfigModal,
    toggleAgentOnline,
  } = useAppStore();
  const [showNameInput, setShowNameInput] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");

  const workspace = workspaces.find((w) => w.id === activeWorkspaceId);

  if (!activeWorkspaceId || !workspace) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-muted">
        <Bot className="h-12 w-12 opacity-20" />
        <p className="text-sm text-center">Select or create a workspace to start</p>
      </div>
    );
  }

  const handleClickAgent = (agentId: string) => {
    selectAgent(agentId);
    setShowConfigModal(true);
  };

  const handleStartAdd = () => {
    setNewAgentName("");
    setShowNameInput(true);
  };

  const handleConfirmAdd = () => {
    const name = newAgentName.trim();
    if (name) {
      addAgent(workspace.id, name);
    }
    setShowNameInput(false);
    setNewAgentName("");
  };

  const handleCancelAdd = () => {
    setShowNameInput(false);
    setNewAgentName("");
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header — workspace name only, no Add AI button */}
      <div className="flex items-center border-b px-4 py-3 pl-14 md:px-6 md:pl-6">
        <h2 className="text-sm font-semibold truncate">{workspace.name}</h2>
      </div>

      {/* Name input dialog */}
      {showNameInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCancelAdd}
          />
          <div className="relative w-full max-w-xs rounded-2xl border bg-card p-5 shadow-xl mx-4">
            <h3 className="text-sm font-semibold">Name your AI Agent</h3>
            <p className="mt-1 text-xs text-muted">Give it a name to get started</p>
            <input
              autoFocus
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirmAdd();
                if (e.key === "Escape") handleCancelAdd();
              }}
              placeholder="e.g. Sales Bot, Support Agent..."
              className="mt-3 h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-foreground"
            />
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={handleCancelAdd}
                className="h-8 rounded-lg border px-3 text-xs font-medium transition-colors hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdd}
                disabled={!newAgentName.trim()}
                className="h-8 rounded-lg bg-foreground px-4 text-xs font-medium text-accent-foreground transition-all hover:opacity-90 disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {workspace.agents.map((agent) => {
            const hasBrain = !!agent.brain;
            const hasLimbs = agent.limbs.some((l) => l.enabled);
            const hasChat = agent.chat.length > 0;
            const isComplete = hasBrain && hasLimbs && hasChat;

            return (
              <div
                key={agent.id}
                className="flex flex-col rounded-2xl border bg-card transition-all hover:border-foreground/20 hover:shadow-sm"
              >
                <button
                  onClick={() => handleClickAgent(agent.id)}
                  className="flex flex-col items-center gap-2 p-4 active:scale-[0.98] sm:gap-3 sm:p-5"
                >
                  <div className="h-12 w-12 sm:h-16 sm:w-16">
                    <AgentFace isComplete={isComplete} isOnline={agent.isOnline} />
                  </div>
                  <p className="text-xs font-medium sm:text-sm">{agent.name}</p>
                  <div className="flex items-center gap-2">
                    <Brain className={`h-3.5 w-3.5 ${hasBrain ? "text-foreground" : "text-border"}`} />
                    <div className="h-3 w-px bg-border" />
                    <Wrench className={`h-3.5 w-3.5 ${hasLimbs ? "text-foreground" : "text-border"}`} />
                    <div className="h-3 w-px bg-border" />
                    <MessageSquare className={`h-3.5 w-3.5 ${hasChat ? "text-foreground" : "text-border"}`} />
                  </div>
                </button>

                <div className="flex items-center justify-center gap-2 border-t px-4 py-2">
                  <span className={`text-[10px] font-medium ${agent.isOnline ? "text-blue-600" : "text-muted"}`}>
                    {agent.isOnline ? "Online" : "Offline"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAgentOnline(workspace.id, agent.id);
                    }}
                    disabled={!isComplete && !agent.isOnline}
                    title={!isComplete ? "Configure Brain, Limbs, and Chat first" : ""}
                    className={`flex h-5 w-9 items-center rounded-full transition-colors ${
                      agent.isOnline
                        ? "bg-blue-600"
                        : isComplete
                          ? "bg-border"
                          : "bg-border opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                        agent.isOnline ? "translate-x-[18px]" : "translate-x-[3px]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}

          {/* The + card — always visible as the way to add agents */}
          <button
            onClick={handleStartAdd}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border p-4 text-muted transition-colors hover:border-foreground/20 hover:text-foreground sm:p-5"
          >
            <div className="h-12 w-12 sm:h-16 sm:w-16">
              <svg viewBox="0 0 64 64" className="h-full w-full">
                <rect width="64" height="64" rx="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                <line x1="32" y1="20" x2="32" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="20" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs font-medium">Add AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
