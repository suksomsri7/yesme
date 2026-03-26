"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Cpu, MessageCircle } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-8 text-center sm:gap-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground sm:h-12 sm:w-12">
            <Bot className="h-5 w-5 text-accent-foreground sm:h-6 sm:w-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">YesMe</h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Build AI Agents,
            <br />
            Visually.
          </h2>
          <p className="max-w-md text-base text-muted sm:text-lg">
            Configure brains, tools, and channels for your AI agents.
            Connect them together like building blocks.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted sm:gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            <span>AI Models</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>OpenClaw Tools</span>
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Channels</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="group flex h-12 items-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-accent-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
