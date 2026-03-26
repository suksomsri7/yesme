"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  Check,
  Coins,
  Plus,
  ArrowLeft,
  Clock,
  Zap,
  CreditCard,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from "lucide-react";
import * as XLSX from "xlsx";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tokens: 1000,
    features: ["1 Workspace", "2 AI Agents", "1,000 tokens/mo", "Community support"],
  },
  {
    id: "basic",
    name: "Basic",
    monthly: 19,
    yearly: 190,
    tokens: 50000,
    features: ["5 Workspaces", "10 AI Agents", "50,000 tokens/mo", "Email support", "All channels"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 49,
    yearly: 490,
    tokens: 200000,
    popular: true,
    features: ["Unlimited Workspaces", "50 AI Agents", "200,000 tokens/mo", "Priority support", "All channels", "Advanced analytics"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 199,
    yearly: 1990,
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

interface UsageRecord {
  id: number;
  date: string;
  type: "usage" | "topup" | "plan";
  agent: string;
  model: string;
  direction: "input" | "output" | "-";
  tokens: number;
  cost: number;
}

const MOCK_USAGE: UsageRecord[] = [
  { id: 1, date: "2026-03-26 10:30", type: "usage", agent: "Sales Bot", model: "GPT-4o", direction: "input", tokens: 1200, cost: 0.003 },
  { id: 2, date: "2026-03-26 10:30", type: "usage", agent: "Sales Bot", model: "GPT-4o", direction: "output", tokens: 350, cost: 0.0035 },
  { id: 3, date: "2026-03-26 09:15", type: "usage", agent: "Support", model: "Claude 3.5 Sonnet", direction: "input", tokens: 800, cost: 0.0024 },
  { id: 4, date: "2026-03-26 09:15", type: "usage", agent: "Support", model: "Claude 3.5 Sonnet", direction: "output", tokens: 420, cost: 0.0063 },
  { id: 5, date: "2026-03-25 18:00", type: "topup", agent: "-", model: "-", direction: "-", tokens: 50000, cost: 20 },
  { id: 6, date: "2026-03-25 14:22", type: "usage", agent: "Sales Bot", model: "GPT-4o", direction: "input", tokens: 950, cost: 0.00238 },
  { id: 7, date: "2026-03-25 14:22", type: "usage", agent: "Sales Bot", model: "GPT-4o", direction: "output", tokens: 280, cost: 0.0028 },
  { id: 8, date: "2026-03-25 11:10", type: "usage", agent: "Support", model: "GPT-4o", direction: "input", tokens: 2100, cost: 0.00525 },
  { id: 9, date: "2026-03-25 11:10", type: "usage", agent: "Support", model: "GPT-4o", direction: "output", tokens: 600, cost: 0.006 },
  { id: 10, date: "2026-03-24 20:00", type: "plan", agent: "-", model: "-", direction: "-", tokens: 0, cost: 49 },
  { id: 11, date: "2026-03-24 16:30", type: "usage", agent: "Translator Bot", model: "Gemini Flash", direction: "input", tokens: 500, cost: 0.0000375 },
  { id: 12, date: "2026-03-24 16:30", type: "usage", agent: "Translator Bot", model: "Gemini Flash", direction: "output", tokens: 480, cost: 0.000144 },
  { id: 13, date: "2026-03-23 09:00", type: "topup", agent: "-", model: "-", direction: "-", tokens: 200000, cost: 0 },
  { id: 14, date: "2026-03-23 08:15", type: "usage", agent: "Sales Bot", model: "GPT-4o Mini", direction: "input", tokens: 3000, cost: 0.00045 },
  { id: 15, date: "2026-03-23 08:15", type: "usage", agent: "Sales Bot", model: "GPT-4o Mini", direction: "output", tokens: 1500, cost: 0.0009 },
  { id: 16, date: "2026-03-22 14:00", type: "usage", agent: "Support", model: "Claude 3 Haiku", direction: "input", tokens: 4000, cost: 0.001 },
  { id: 17, date: "2026-03-22 14:00", type: "usage", agent: "Support", model: "Claude 3 Haiku", direction: "output", tokens: 1800, cost: 0.00225 },
  { id: 18, date: "2026-03-21 10:00", type: "usage", agent: "Code Helper", model: "Claude 3.5 Sonnet", direction: "input", tokens: 5000, cost: 0.015 },
  { id: 19, date: "2026-03-21 10:00", type: "usage", agent: "Code Helper", model: "Claude 3.5 Sonnet", direction: "output", tokens: 3200, cost: 0.048 },
  { id: 20, date: "2026-03-20 09:00", type: "topup", agent: "-", model: "-", direction: "-", tokens: 100000, cost: 35 },
];

function getDateOnly(dateStr: string): string {
  return dateStr.split(" ")[0];
}

export default function BillingPage() {
  const { currentPlan, tokenBalance, setCurrentPlan, addTokens, setActiveView } =
    useAppStore();
  const [showTopUp, setShowTopUp] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterType, setFilterType] = useState<"all" | "usage" | "topup" | "plan">("all");

  const filtered = useMemo(() => {
    return MOCK_USAGE.filter((item) => {
      if (filterType !== "all" && item.type !== filterType) return false;
      const d = getDateOnly(item.date);
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    });
  }, [dateFrom, dateTo, filterType]);

  const totalTokens = useMemo(
    () => filtered.filter((r) => r.type === "usage").reduce((s, r) => s + r.tokens, 0),
    [filtered]
  );
  const totalCost = useMemo(
    () => filtered.filter((r) => r.type === "usage").reduce((s, r) => s + r.cost, 0),
    [filtered]
  );

  const exportToExcel = () => {
    const rows = filtered.map((r) => ({
      Date: r.date,
      Type: r.type,
      Agent: r.agent,
      Model: r.model,
      Direction: r.direction,
      Tokens: r.tokens,
      "Cost ($)": r.cost.toFixed(6),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usage History");

    ws["!cols"] = [
      { wch: 18 },
      { wch: 8 },
      { wch: 16 },
      { wch: 20 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
    ];

    XLSX.writeFile(wb, `yesme-usage-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="flex flex-1 flex-col">
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
          {/* Plans */}
          <div className="mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Choose your plan
              </h3>
              {/* Monthly / Yearly toggle */}
              <div className="flex items-center gap-2 rounded-full border p-1">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-foreground text-accent-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    billingCycle === "yearly"
                      ? "bg-foreground text-accent-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Yearly
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PLANS.map((plan) => {
                const isActive = currentPlan === plan.id;
                const price = billingCycle === "monthly" ? plan.monthly : plan.yearly;
                const perMonth = billingCycle === "yearly" && plan.yearly > 0
                  ? Math.round((plan.yearly / 12) * 100) / 100
                  : plan.monthly;
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border p-4 transition-all ${
                      isActive ? "border-foreground bg-foreground/5" : "hover:border-foreground/20"
                    }`}
                  >
                    {"popular" in plan && plan.popular && (
                      <span className="absolute -top-2.5 left-4 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Popular
                      </span>
                    )}
                    <p className="text-sm font-semibold">{plan.name}</p>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">${price}</span>
                      <span className="text-xs text-muted">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && plan.yearly > 0 && (
                      <p className="mt-0.5 text-[10px] text-muted">
                        ${perMonth}/mo · save ${plan.monthly * 12 - plan.yearly}/yr
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-muted">{plan.tokens.toLocaleString()} tokens/mo</p>
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

          {/* Token Credit */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Token Credit</h3>
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
                      <span className="text-sm font-semibold">{pack.amount.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-muted">${pack.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Usage History */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Usage History
              </h3>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-medium text-muted hover:bg-background hover:text-foreground transition-colors"
              >
                <Download className="h-3 w-3" />
                Export Excel
              </button>
            </div>

            {/* Filters */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted">
                <Filter className="h-3 w-3" />
                Filter:
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="h-7 rounded-md border bg-background px-2 text-[11px] outline-none"
              >
                <option value="all">All types</option>
                <option value="usage">Usage only</option>
                <option value="topup">Top-up only</option>
                <option value="plan">Plan changes</option>
              </select>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-7 rounded-md border bg-background px-2 text-[11px] outline-none"
              />
              <span className="text-[10px] text-muted">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-7 rounded-md border bg-background px-2 text-[11px] outline-none"
              />
              {(dateFrom || dateTo || filterType !== "all") && (
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                    setFilterType("all");
                  }}
                  className="text-[10px] text-muted hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Summary */}
            <div className="mt-3 flex gap-3">
              <div className="flex-1 rounded-xl border bg-background px-3 py-2">
                <p className="text-[10px] text-muted">Usage Tokens</p>
                <p className="text-sm font-bold">{totalTokens.toLocaleString()}</p>
              </div>
              <div className="flex-1 rounded-xl border bg-background px-3 py-2">
                <p className="text-[10px] text-muted">Usage Cost</p>
                <p className="text-sm font-bold">${totalCost.toFixed(4)}</p>
              </div>
              <div className="flex-1 rounded-xl border bg-background px-3 py-2">
                <p className="text-[10px] text-muted">Records</p>
                <p className="text-sm font-bold">{filtered.length}</p>
              </div>
            </div>

            {/* Table */}
            <div className="mt-3 overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b bg-background text-[10px] font-semibold uppercase tracking-wider text-muted">
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Agent</th>
                    <th className="px-3 py-2.5">Model</th>
                    <th className="px-3 py-2.5">I/O</th>
                    <th className="px-3 py-2.5 text-right">Tokens</th>
                    <th className="px-4 py-2.5 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted">
                        No records found
                      </td>
                    </tr>
                  )}
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-muted whitespace-nowrap">{r.date}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                            r.type === "usage"
                              ? "bg-background text-foreground"
                              : r.type === "topup"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {r.type === "usage" && <Clock className="h-2.5 w-2.5" />}
                          {r.type === "topup" && <CreditCard className="h-2.5 w-2.5" />}
                          {r.type === "plan" && <Zap className="h-2.5 w-2.5" />}
                          {r.type}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs font-medium">
                        {r.agent === "-" ? (
                          <span className="text-muted">—</span>
                        ) : (
                          r.agent
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted">
                        {r.model === "-" ? "—" : r.model}
                      </td>
                      <td className="px-3 py-2.5">
                        {r.direction === "input" ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-blue-600">
                            <ArrowDownLeft className="h-2.5 w-2.5" />
                            IN
                          </span>
                        ) : r.direction === "output" ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-orange-600">
                            <ArrowUpRight className="h-2.5 w-2.5" />
                            OUT
                          </span>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right text-xs font-semibold tabular-nums">
                        {r.type === "topup" ? (
                          <span className="text-emerald-600">+{r.tokens.toLocaleString()}</span>
                        ) : r.tokens > 0 ? (
                          r.tokens.toLocaleString()
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs tabular-nums text-muted">
                        {r.cost > 0 ? `$${r.cost.toFixed(4)}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
