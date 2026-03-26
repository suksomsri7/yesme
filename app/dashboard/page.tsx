"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import AgentCanvas from "@/components/AgentCanvas";
import BillingPage from "@/components/BillingPage";
import AiConfigModal from "@/components/modals/AiConfigModal";

export default function DashboardPage() {
  const router = useRouter();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const activeView = useAppStore((s) => s.activeView);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex h-dvh flex-1 flex-col md:flex-row">
      <WorkspaceSidebar />
      {activeView === "workspace" && <AgentCanvas />}
      {activeView === "billing" && <BillingPage />}
      {activeView === "settings" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted">
          <p className="text-sm">Settings — Coming soon</p>
        </div>
      )}
      <AiConfigModal />
    </div>
  );
}
