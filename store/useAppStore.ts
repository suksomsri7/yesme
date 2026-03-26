"use client";

import { create } from "zustand";
import type { Workspace, AIAgent } from "@/lib/types";
import { OPENCLAW_PACKAGES } from "@/lib/types";

const DEFAULT_WS_ID = "ws-default";

export type ActiveView = "workspace" | "billing" | "settings";

interface AppState {
  isLoggedIn: boolean;
  activeView: ActiveView;
  currentPlan: string;
  tokenBalance: number;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  selectedAgentId: string | null;
  showConfigModal: boolean;

  login: () => void;
  logout: () => void;
  setActiveView: (view: ActiveView) => void;
  setCurrentPlan: (plan: string) => void;
  addTokens: (amount: number) => void;

  addWorkspace: (name: string) => void;
  removeWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  setActiveWorkspace: (id: string) => void;

  addAgent: (workspaceId: string, name: string) => void;
  removeAgent: (workspaceId: string, agentId: string) => void;
  updateAgent: (workspaceId: string, agentId: string, updates: Partial<AIAgent>) => void;
  toggleAgentOnline: (workspaceId: string, agentId: string) => void;
  selectAgent: (agentId: string | null) => void;
  setShowConfigModal: (show: boolean) => void;
}

function isAgentComplete(agent: AIAgent): boolean {
  return !!agent.brain && agent.limbs.some((l) => l.enabled) && agent.chat.length > 0;
}

let agentCounter = 0;

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  activeView: "workspace" as ActiveView,
  currentPlan: "free",
  tokenBalance: 1000,
  workspaces: [{ id: DEFAULT_WS_ID, name: "Workspace", agents: [] }],
  activeWorkspaceId: DEFAULT_WS_ID,
  selectedAgentId: null,
  showConfigModal: false,

  login: () => set({ isLoggedIn: true }),
  logout: () =>
    set({
      isLoggedIn: false,
      activeView: "workspace" as ActiveView,
      currentPlan: "free",
      tokenBalance: 1000,
      workspaces: [{ id: DEFAULT_WS_ID, name: "Workspace", agents: [] }],
      activeWorkspaceId: DEFAULT_WS_ID,
    }),
  setActiveView: (view: ActiveView) => set({ activeView: view }),
  setCurrentPlan: (plan: string) => set({ currentPlan: plan }),
  addTokens: (amount: number) =>
    set((state) => ({ tokenBalance: state.tokenBalance + amount })),

  addWorkspace: (name: string) => {
    const id = `ws-${Date.now()}`;
    set((state) => ({
      workspaces: [...state.workspaces, { id, name, agents: [] }],
      activeWorkspaceId: id,
    }));
  },

  removeWorkspace: (id: string) => {
    set((state) => {
      const remaining = state.workspaces.filter((w) => w.id !== id);
      return {
        workspaces: remaining,
        activeWorkspaceId:
          state.activeWorkspaceId === id
            ? remaining[0]?.id ?? null
            : state.activeWorkspaceId,
      };
    });
  },

  renameWorkspace: (id: string, name: string) => {
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === id ? { ...w, name } : w
      ),
    }));
  },

  setActiveWorkspace: (id: string) => set({ activeWorkspaceId: id }),

  addAgent: (workspaceId: string, name: string) => {
    agentCounter++;
    const newAgent: AIAgent = {
      id: `agent-${Date.now()}`,
      name,
      avatar: `/avatars/robot-${((agentCounter - 1) % 6) + 1}.svg`,
      isOnline: false,
      brain: null,
      limbs: OPENCLAW_PACKAGES.map((p) => ({ ...p })),
      chat: [],
    };
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId ? { ...w, agents: [...w.agents, newAgent] } : w
      ),
    }));
  },

  removeAgent: (workspaceId: string, agentId: string) => {
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId
          ? { ...w, agents: w.agents.filter((a) => a.id !== agentId) }
          : w
      ),
    }));
  },

  updateAgent: (workspaceId: string, agentId: string, updates: Partial<AIAgent>) => {
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId
          ? {
              ...w,
              agents: w.agents.map((a) => {
                if (a.id !== agentId) return a;
                const updated = { ...a, ...updates };
                if (!isAgentComplete(updated)) {
                  updated.isOnline = false;
                }
                return updated;
              }),
            }
          : w
      ),
    }));
  },

  toggleAgentOnline: (workspaceId: string, agentId: string) => {
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspaceId
          ? {
              ...w,
              agents: w.agents.map((a) => {
                if (a.id !== agentId) return a;
                if (!a.isOnline && !isAgentComplete(a)) return a;
                return { ...a, isOnline: !a.isOnline };
              }),
            }
          : w
      ),
    }));
  },

  selectAgent: (agentId: string | null) => set({ selectedAgentId: agentId }),
  setShowConfigModal: (show: boolean) => set({ showConfigModal: show }),
}));
