"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Plus, Bot, Brain, Wrench, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function AgentCanvas() {
  const { workspaces, activeWorkspaceId, addAgent, selectAgent, setShowConfigModal } =
    useAppStore();
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
      <div className="flex items-center justify-between border-b px-4 py-3 pl-14 md:px-6 md:pl-6">
        <h2 className="text-sm font-semibold truncate">{workspace.name}</h2>
        <button
          onClick={handleStartAdd}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-accent-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add AI
        </button>
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
        {workspace.agents.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-muted">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border">
              <Plus className="h-6 w-6 opacity-40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">No agents yet</p>
              <p className="mt-1 text-xs text-muted">Tap &quot;Add AI&quot; to create your first agent</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {workspace.agents.map((agent) => {
              const activeTool = agent.limbs.find((l) => l.enabled);
              const activeChannel = agent.chat[0];
              return (
                <button
                  key={agent.id}
                  onClick={() => handleClickAgent(agent.id)}
                  className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-sm active:scale-[0.98] sm:gap-3 sm:p-5"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl sm:h-16 sm:w-16">
                    <Image
                      src={agent.avatar}
                      alt={agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium sm:text-sm">{agent.name}</p>
                  </div>
                  {/* Icon row: Brain / Limbs / Chat */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1" title={`Brain: ${agent.brain.model}`}>
                      <Brain className={`h-3.5 w-3.5 ${agent.brain.model ? "text-foreground" : "text-border"}`} />
                      <span className="hidden text-[9px] text-muted sm:inline">{agent.brain.model.split("-").slice(0, 2).join("-")}</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1" title={activeTool ? `Limbs: ${activeTool.name}` : "No tool"}>
                      <Wrench className={`h-3.5 w-3.5 ${activeTool ? "text-foreground" : "text-border"}`} />
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1" title={activeChannel ? `Chat: ${activeChannel.name}` : "No channel"}>
                      <MessageSquare className={`h-3.5 w-3.5 ${activeChannel ? "text-foreground" : "text-border"}`} />
                    </div>
                  </div>
                </button>
              );
            })}

            <button
              onClick={handleStartAdd}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-4 text-muted transition-colors hover:border-foreground/20 hover:text-foreground sm:p-5"
            >
              <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-xs font-medium">Add AI</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
