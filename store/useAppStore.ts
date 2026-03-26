"use client";

import { create } from "zustand";
import type { Workspace, AIAgent, ChannelConfig, OpenClawPackage } from "@/lib/types";
import { OPENCLAW_PACKAGES } from "@/lib/types";

interface AppState {
  isLoggedIn: boolean;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  selectedAgentId: string | null;
  showConfigModal: boolean;

  login: () => void;
  logout: () => void;

  addWorkspace: (name: string) => void;
  removeWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string) => void;

  addAgent: (workspaceId: string, name: string) => void;
  removeAgent: (workspaceId: string, agentId: string) => void;
  updateAgent: (workspaceId: string, agentId: string, updates: Partial<AIAgent>) => void;
  toggleAgentOnline: (workspaceId: string, agentId: string) => void;
  selectAgent: (agentId: string | null) => void;
  setShowConfigModal: (show: boolean) => void;
}

let agentCounter = 0;

export const useAppStore = create<AppState>((set, get) => ({
  isLoggedIn: false,
  workspaces: [],
  activeWorkspaceId: null,
  selectedAgentId: null,
  showConfigModal: false,

  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false, workspaces: [], activeWorkspaceId: null }),

  addWorkspace: (name: string) => {
    const id = `ws-${Date.now()}`;
    set((state) => ({
      workspaces: [...state.workspaces, { id, name, agents: [] }],
      activeWorkspaceId: id,
    }));
  },

  removeWorkspace: (id: string) => {
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== id),
      activeWorkspaceId: state.activeWorkspaceId === id ? null : state.activeWorkspaceId,
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
              agents: w.agents.map((a) =>
                a.id === agentId ? { ...a, ...updates } : a
              ),
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
              agents: w.agents.map((a) =>
                a.id === agentId ? { ...a, isOnline: !a.isOnline } : a
              ),
            }
          : w
      ),
    }));
  },

  selectAgent: (agentId: string | null) => set({ selectedAgentId: agentId }),
  setShowConfigModal: (show: boolean) => set({ showConfigModal: show }),
}));
