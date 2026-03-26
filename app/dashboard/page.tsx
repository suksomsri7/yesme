"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import AgentCanvas from "@/components/AgentCanvas";
import AiConfigModal from "@/components/modals/AiConfigModal";

export default function DashboardPage() {
  const router = useRouter();
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex h-dvh flex-1 flex-col md:flex-row">
      <WorkspaceSidebar />
      <AgentCanvas />
      <AiConfigModal />
    </div>
  );
}
