"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  Plus,
  Folder,
  Trash2,
  LogOut,
  Receipt,
  Settings,
  Menu,
  X,
  Bot,
  Pencil,
} from "lucide-react";

export default function WorkspaceSidebar() {
  const {
    workspaces,
    activeWorkspaceId,
    activeView,
    addWorkspace,
    removeWorkspace,
    renameWorkspace,
    setActiveWorkspace,
    setActiveView,
    logout,
  } = useAppStore();
  const [newName, setNewName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      addWorkspace(newName.trim());
      setNewName("");
      setShowInput(false);
    }
  };

  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspace(id);
    setActiveView("workspace");
    setMobileOpen(false);
  };

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const confirmRename = () => {
    if (editingId && editName.trim()) {
      renameWorkspace(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  const sidebar = (
    <aside className="flex h-full w-full flex-col border-r bg-card md:w-60">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
            <Bot className="h-3.5 w-3.5 text-accent-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">YesMe</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-background transition-colors md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Workspaces
        </span>
        <button
          onClick={() => setShowInput(true)}
          className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-background transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
        {showInput && (
          <div className="flex gap-1 p-1">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setShowInput(false);
              }}
              placeholder="Workspace name..."
              className="h-8 flex-1 rounded-md border bg-background px-2 text-xs outline-none focus:border-foreground"
            />
          </div>
        )}

        {workspaces.length === 0 && !showInput && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted">
            <Folder className="h-8 w-8 opacity-30" />
            <p className="text-xs">No workspaces yet</p>
            <button
              onClick={() => setShowInput(true)}
              className="mt-1 text-xs font-medium text-foreground hover:underline"
            >
              Create one
            </button>
          </div>
        )}

        {workspaces.map((ws) => {
          const isActive = activeWorkspaceId === ws.id;
          const isEditing = editingId === ws.id;

          if (isEditing) {
            return (
              <div key={ws.id} className="flex gap-1 p-1">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={confirmRename}
                  className="h-8 flex-1 rounded-md border bg-background px-2 text-xs outline-none focus:border-foreground"
                />
              </div>
            );
          }

          return (
            <button
              key={ws.id}
              onClick={() => handleSelectWorkspace(ws.id)}
              className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "bg-foreground text-accent-foreground"
                  : "hover:bg-background"
              }`}
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{ws.name}</span>
              <span className="text-xs opacity-50">{ws.agents.length}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startRename(ws.id, ws.name);
                }}
                className={`hidden h-5 w-5 items-center justify-center rounded group-hover:flex ${
                  isActive ? "hover:bg-white/20" : "hover:bg-foreground/10"
                }`}
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeWorkspace(ws.id);
                }}
                className={`hidden h-5 w-5 items-center justify-center rounded group-hover:flex ${
                  isActive ? "hover:bg-white/20" : "hover:bg-foreground/10"
                }`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-0.5 border-t p-2">
        <button
          onClick={() => {
            setActiveView("billing");
            setMobileOpen(false);
          }}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
            activeView === "billing"
              ? "bg-foreground text-accent-foreground"
              : "text-muted hover:bg-background hover:text-foreground"
          }`}
        >
          <Receipt className="h-4 w-4" />
          Packages & Bill
        </button>
        <button
          onClick={() => {
            setActiveView("settings");
            setMobileOpen(false);
          }}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
            activeView === "settings"
              ? "bg-foreground text-accent-foreground"
              : "text-muted hover:bg-background hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          Setting
        </button>
        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-lg border bg-card shadow-sm md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="hidden md:flex md:h-full">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-72">{sidebar}</div>
        </div>
      )}
    </>
  );
}
