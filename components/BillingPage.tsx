"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Check, Coins, Plus, ArrowLeft, Clock, Zap, CreditCard } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    tokens: 1000,
    features: ["1 Workspace", "2 AI Agents", "1,000 tokens/mo", "Community support"],
  },
  {
    id: "basic",
    name: "Basic",
    price: 19,
    tokens: 50000,
    features: ["5 Workspaces", "10 AI Agents", "50,000 tokens/mo", "Email support", "All channels"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    tokens: 200000,
    popular: true,
    features: ["Unlimited Workspaces", "50 AI Agents", "200,000 tokens/mo", "Priority support", "All channels", "Advanced analytics"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    tokens: 1000000,
    features: ["Unlimited everything", "Unlimited AI Agents", "1,000,000 tokens/mo", "Dedicated support", "Custom integrations", "SLA guarantee", "SSO & SAML"],
  },
];

const TOKEN_PACKS = [
  { amount: 10000, price: 5 },
  { amount: 50000, price: 20 },
  { amount: 100000, price: 35 },
  { amount: 500000, price: 150 },
];

const MOCK_HISTORY = [
  { id: 1, date: "2026-03-26 10:30", type: "usage", description: "Agent 'Sales Bot' — GPT-4o", tokens: -120 },
  { id: 2, date: "2026-03-26 09:15", type: "usage", description: "Agent 'Support' — Claude 3.5", tokens: -85 },
  { id: 3, date: "2026-03-25 18:00", type: "topup", description: "Token top-up (50,000)", tokens: 50000 },
  { id: 4, date: "2026-03-25 14:22", type: "usage", description: "Agent 'Sales Bot' — Web Search", tokens: -45 },
  { id: 5, date: "2026-03-25 11:10", type: "usage", description: "Agent 'Support' — GPT-4o", tokens: -200 },
  { id: 6, date: "2026-03-24 20:00", type: "plan", description: "Upgraded to Pro plan", tokens: 0 },
  { id: 7, date: "2026-03-24 16:30", type: "usage", description: "Agent 'Translator' — Translator", tokens: -30 },
  { id: 8, date: "2026-03-23 09:00", type: "topup", description: "Monthly token refill (200,000)", tokens: 200000 },
];

export default function BillingPage() {
  const { currentPlan, tokenBalance, setCurrentPlan, addTokens, setActiveView } =
    useAppStore();
  const [showTopUp, setShowTopUp] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 pl-14 md:px-6 md:pl-6">
        <button
          onClick={() => setActiveView("workspace")}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-background transition-colors md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-semibold">Packages & Bill</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-4 md:p-6">
          {/* Section: Plans */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Choose your plan
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan) => {
                const isActive = currentPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border p-4 transition-all ${
                      isActive
                        ? "border-foreground bg-foreground/5"
                        : "hover:border-foreground/20"
                    }`}
                  >
                    {"popular" in plan && plan.popular && (
                      <span className="absolute -top-2.5 left-4 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Popular
                      </span>
                    )}
                    <p className="text-sm font-semibold">{plan.name}</p>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">${plan.price}</span>
                      <span className="text-xs text-muted">/mo</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted">
                      {plan.tokens.toLocaleString()} tokens/mo
                    </p>
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-muted">
                          <Check className="h-3 w-3 shrink-0 text-foreground" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setCurrentPlan(plan.id)}
                      disabled={isActive}
                      className={`mt-4 h-8 w-full rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "border bg-background text-muted cursor-default"
                          : "bg-foreground text-accent-foreground hover:opacity-90"
                      }`}
                    >
                      {isActive ? "Current Plan" : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Token Credit */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Token Credit
            </h3>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <Coins className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted">Available Balance</p>
                  <p className="text-xl font-bold">{tokenBalance.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setShowTopUp(!showTopUp)}
                className="flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 text-xs font-medium text-accent-foreground transition-all hover:opacity-90 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Top Up
              </button>
            </div>

            {showTopUp && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TOKEN_PACKS.map((pack) => (
                  <button
                    key={pack.amount}
                    onClick={() => {
                      addTokens(pack.amount);
                      setShowTopUp(false);
                    }}
                    className="flex flex-col items-center gap-1 rounded-xl border p-3 transition-all hover:border-foreground/20 hover:shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-500" />
                      <span className="text-sm font-semibold">
                        {pack.amount.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-muted">${pack.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section: Usage History */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Usage History
            </h3>
            <div className="mt-3 rounded-2xl border">
              <div className="divide-y">
                {MOCK_HISTORY.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          item.type === "topup"
                            ? "bg-emerald-100"
                            : item.type === "plan"
                              ? "bg-blue-100"
                              : "bg-background"
                        }`}
                      >
                        {item.type === "topup" ? (
                          <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                        ) : item.type === "plan" ? (
                          <Zap className="h-3.5 w-3.5 text-blue-600" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-muted" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{item.description}</p>
                        <p className="text-[10px] text-muted">{item.date}</p>
                      </div>
                    </div>
                    {item.tokens !== 0 && (
                      <span
                        className={`text-xs font-semibold ${
                          item.tokens > 0 ? "text-emerald-600" : "text-foreground"
                        }`}
                      >
                        {item.tokens > 0 ? "+" : ""}
                        {item.tokens.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted/50">
              Showing mock data — connect to backend for live usage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
