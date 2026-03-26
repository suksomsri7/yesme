"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Bot, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
              <Bot className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">YesMe</span>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-10 rounded-lg border bg-card px-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-muted">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 w-full rounded-lg border bg-card px-3 pr-10 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-10 items-center justify-center rounded-lg bg-foreground text-sm font-medium text-accent-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-xs text-muted">
            Don&apos;t have an account?{" "}
            <button className="font-medium text-foreground hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
