import React, { useMemo, useState } from "react";
import {
  BarChart3,
  MessageSquare,
  Bot,
  Clock3,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  MessageCircle,
  Globe2,
  Share2,
  CheckCircle2,
  UserRound,
  Sparkles,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import { useSettings } from "../hooks/useSettings";

/* =========================================================
   CHANNEL ICON
========================================================= */

const ChannelIcon = ({ name }) => {
  if (name === "WhatsApp") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:ring-emerald-800/50">
        <MessageCircle
          size={18}
          className="text-emerald-600 dark:text-emerald-400"
        />
      </div>
    );
  }

  if (name === "Instagram") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 ring-1 ring-pink-100 dark:bg-pink-900/20 dark:ring-pink-800/50">
        <Share2
          size={18}
          className="text-pink-600 dark:text-pink-400"
        />
      </div>
    );
  }

  if (name === "Facebook") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:ring-blue-800/50">
        <Share2
          size={18}
          className="text-blue-600 dark:text-blue-400"
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 ring-1 ring-violet-100 dark:bg-violet-900/20 dark:ring-violet-800/50">
      <Globe2
        size={18}
        className="text-violet-600 dark:text-violet-400"
      />
    </div>
  );
};

/* =========================================================
   ANALYTICS PAGE
========================================================= */

const Analytics = () => {
  const [range, setRange] = useState("30 days");
  const [showAllGaps, setShowAllGaps] = useState(false);

  const { data, loading, error, refetch } = useAnalytics(range);
  const { settings } = useSettings();
  const currency = settings?.general?.currency || "GHS";

  const aiRate = useMemo(() => {
    if (!data?.conversations) return 0;

    return (
      (data.aiResolved / data.conversations) *
      100
    ).toFixed(1);
  }, [data]);

  const humanRate = useMemo(() => {
    return Math.max(
      0,
      100 - Number(aiRate)
    ).toFixed(1);
  }, [aiRate]);

  const conversionRate = useMemo(() => {
    if (!data?.funnel?.conversations) return 0;

    return (
      (data.funnel.completedOrders /
        data.funnel.conversations) *
      100
    ).toFixed(1);
  }, [data]);

  const handoffRate = useMemo(() => {
    if (!data?.conversations) return 0;

    return (
      (data.handoffs /
        data.conversations) *
      100
    ).toFixed(1);
  }, [data]);

  const visibleKnowledgeGaps = useMemo(() => {
    if (!data?.knowledgeGaps) return [];

    return showAllGaps
      ? data.knowledgeGaps
      : data.knowledgeGaps.slice(0, 3);
  }, [data, showAllGaps]);

  if (loading) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-surface-950 dark:via-surface-900 dark:to-violet-950/20">
        <div className="rounded-2xl border border-violet-100 bg-white/90 px-8 py-7 text-center shadow-xl shadow-violet-500/10 dark:border-violet-900/40 dark:bg-surface-900/90">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/30">
            <Loader2
              size={25}
              className="animate-spin text-violet-600 dark:text-violet-400"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Loading analytics...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Preparing your business insights
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 dark:from-surface-950 dark:via-surface-900 dark:to-rose-950/20">
        <div className="max-w-sm rounded-2xl border border-rose-100 bg-white p-7 text-center shadow-xl shadow-rose-500/10 dark:border-rose-900/40 dark:bg-surface-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/30">
            <AlertCircle
              size={25}
              className="text-rose-600 dark:text-rose-400"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
            Failed to load analytics
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            {error}
          </p>

          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-surface-950 dark:via-surface-900 dark:to-violet-950/20">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-lg dark:border-slate-700 dark:bg-surface-900">
          <BarChart3
            size={28}
            className="mx-auto text-violet-500"
          />

          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            No analytics data
          </p>

          <p className="mt-1 text-xs text-slate-400">
            There is currently no data available for this period.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gradient-to-br from-violet-50/60 via-slate-50 to-pink-50/50 dark:from-surface-950 dark:via-surface-900 dark:to-violet-950/20">

      {/* ===================================================
          FIXED HEADER
      ==================================================== */}

      <header className="shrink-0 border-b border-violet-100/80 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-xl dark:border-surface-700 dark:bg-surface-900/95 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25">
                <BarChart3
                  size={20}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Analytics
                </h1>

                <div className="mt-0.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_7px_rgba(16,185,129,0.6)]" />

                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Business intelligence
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Track customer engagement, AI performance and sales.
            </p>
          </div>

          <div className="relative shrink-0">
            <select
              value={range}
              onChange={(event) =>
                setRange(event.target.value)
              }
              className="appearance-none rounded-xl border border-violet-200 bg-violet-50/70 py-2.5 pl-4 pr-10 text-xs font-semibold text-violet-700 outline-none transition hover:border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-300"
            >
              <option value="Today">Today</option>
              <option value="7 days">7 days</option>
              <option value="30 days">30 days</option>
              <option value="90 days">90 days</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-violet-500"
            />
          </div>
        </div>
      </header>

      {/* ===================================================
          ONLY MAIN CONTENT SCROLLS
      ==================================================== */}

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-[1800px] space-y-5 p-4 sm:p-5 lg:p-6">

          {/* =================================================
              METRICS
          ================================================== */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              icon={MessageSquare}
              title="Conversations"
              value={data.conversations.toLocaleString()}
              change={data.conversationsChange}
              positive={true}
              description="vs previous period"
              accent="info"
            />

            <MetricCard
              icon={Bot}
              title="AI resolution rate"
              value={`${aiRate}%`}
              change={data.aiResolvedChange}
              positive={true}
              description={`${data.aiResolved.toLocaleString()} conversations handled by AI`}
              accent="ai"
            />

            <MetricCard
              icon={Clock3}
              title="Avg. response time"
              value={`${data.responseTime}s`}
              change={Math.abs(data.responseTimeChange)}
              positive={data.responseTimeChange < 0}
              description={
                data.responseTimeChange < 0
                  ? "faster than previous period"
                  : "slower than previous period"
              }
              accent="warning"
            />

            <MetricCard
              icon={CircleDollarSign}
              title="Revenue influenced"
              value={`${currency} ${data.revenue.toLocaleString()}`}
              change={data.revenueChange}
              positive={true}
              description="vs previous period"
              accent="order"
            />
          </div>

          {/* =================================================
              CONVERSATIONS + INTENTS
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

            {/* Conversation trend */}

            <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm shadow-violet-500/5 transition hover:shadow-md dark:border-surface-700 dark:bg-surface-900">

              <div className="flex items-start justify-between gap-4 border-b border-violet-50 bg-gradient-to-r from-violet-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-violet-950/20">

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                      <TrendingUp
                        size={14}
                        className="text-violet-600 dark:text-violet-400"
                      />
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Conversations
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Customer conversations over time
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                  {range}
                </span>
              </div>

              <div className="p-5">
                <SimpleLineChart
                  values={data.conversationChart}
                />
              </div>
            </section>

            {/* Intent */}

            <section className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm shadow-pink-500/5 transition hover:shadow-md dark:border-surface-700 dark:bg-surface-900">

              <div className="border-b border-pink-50 bg-gradient-to-r from-pink-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-pink-950/20">

                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                    <MessageCircle
                      size={14}
                      className="text-pink-600 dark:text-pink-400"
                    />
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Customer intent
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  What customers ask about most
                </p>
              </div>

              <div className="space-y-4 p-5">
                {data.intents.map((intent, index) => {
                  const intentColors = [
                    "bg-pink-500",
                    "bg-violet-500",
                    "bg-blue-500",
                    "bg-orange-500",
                    "bg-emerald-500",
                  ];

                  return (
                    <div key={intent.name}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">

                        <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {intent.name}
                        </span>

                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {intent.value}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${intentColors[index % intentColors.length]} transition-all duration-500`}
                          style={{
                            width: `${intent.value}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* =================================================
              SALES FUNNEL
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm shadow-emerald-500/5 dark:border-surface-700 dark:bg-surface-900">

            <div className="flex flex-col gap-3 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/70 via-transparent to-transparent px-5 py-4 dark:border-surface-700 dark:from-emerald-950/20 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <ShoppingBag
                      size={14}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Conversation → Purchase
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  How customer conversations move toward completed orders
                </p>
              </div>

              <div className="w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {conversionRate}% conversion
              </div>
            </div>

            <div className="grid md:grid-cols-4">
              <FunnelStep
                number="01"
                label="Conversations"
                value={data.funnel.conversations}
                icon={MessageSquare}
                accent="violet"
              />

              <FunnelStep
                number="02"
                label="Product interest"
                value={data.funnel.productInterest}
                icon={ShoppingBag}
                accent="pink"
              />

              <FunnelStep
                number="03"
                label="Order attempts"
                value={data.funnel.orderAttempts}
                icon={Package}
                accent="orange"
              />

              <FunnelStep
                number="04"
                label="Completed orders"
                value={data.funnel.completedOrders}
                icon={CheckCircle2}
                accent="emerald"
                last
              />
            </div>
          </section>

          {/* =================================================
              PRODUCTS + CHANNELS
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-2">

            {/* Products */}

            <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-500/5 dark:border-surface-700 dark:bg-surface-900">

              <div className="flex items-center justify-between border-b border-orange-50 bg-gradient-to-r from-orange-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-orange-950/20">

                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <Package
                        size={14}
                        className="text-orange-600 dark:text-orange-400"
                      />
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Top products
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Products generating the most interest
                  </p>
                </div>

                <Package
                  size={18}
                  className="text-orange-400"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">

                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">

                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Product
                      </th>

                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Enquiries
                      </th>

                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Orders
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                    {data.topProducts.map(
                      (product, index) => (
                        <tr
                          key={product.name}
                          className="transition hover:bg-orange-50/40 dark:hover:bg-orange-950/10"
                        >
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                                index === 0
                                  ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                  : index === 1
                                  ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                                  : index === 2
                                  ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                              }`}>
                                {index + 1}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                                  {product.name}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  Product interest
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {product.enquiries.toLocaleString()}
                          </td>

                          <td className="px-3 py-4 text-right text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {product.orders.toLocaleString()}
                          </td>

                          <td className="px-5 py-4 text-right text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {currency}{" "}
                            {product.revenue.toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Channels */}

            <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-500/5 dark:border-surface-700 dark:bg-surface-900">

              <div className="border-b border-blue-50 bg-gradient-to-r from-blue-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-blue-950/20">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Globe2
                      size={14}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Channel performance
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Where customer conversations originate
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">

                {data.channels.map((channel) => (
                  <div
                    key={channel.name}
                    className="px-5 py-4 transition hover:bg-blue-50/30 dark:hover:bg-blue-950/10"
                  >
                    <div className="flex items-center gap-3">

                      <ChannelIcon
                        name={channel.name}
                      />

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {channel.name}
                          </p>

                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {channel.value}%
                          </p>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              channel.name === "WhatsApp"
                                ? "bg-emerald-500"
                                : channel.name === "Instagram"
                                ? "bg-pink-500"
                                : channel.name === "Facebook"
                                ? "bg-blue-500"
                                : "bg-violet-500"
                            }`}
                            style={{
                              width: `${channel.value}%`,
                            }}
                          />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">

                          <span>
                            {channel.conversations.toLocaleString()}{" "}
                            conversations
                          </span>

                          <span>
                            {channel.orders.toLocaleString()}{" "}
                            orders
                          </span>

                          <span>
                            {currency}{" "}
                            {channel.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* =================================================
              AI + CUSTOMER ACTIVITY
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-2">

            {/* AI */}

            <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm shadow-violet-500/5 dark:border-surface-700 dark:bg-surface-900">

              <div className="border-b border-violet-50 bg-gradient-to-r from-violet-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-violet-950/20">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Sparkles
                      size={14}
                      className="text-violet-600 dark:text-violet-400"
                    />
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI performance
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  How the AI is handling customer conversations
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">

                <MiniMetric
                  icon={Bot}
                  label="AI handled"
                  value={data.aiResolved.toLocaleString()}
                  accent="violet"
                />

                <MiniMetric
                  icon={UserRound}
                  label="Human handled"
                  value={(
                    data.conversations -
                    data.aiResolved
                  ).toLocaleString()}
                  accent="blue"
                />

                <MiniMetric
                  icon={CheckCircle2}
                  label="Resolution rate"
                  value={`${aiRate}%`}
                  accent="emerald"
                />

                <MiniMetric
                  icon={Clock3}
                  label="Avg. response"
                  value={`${data.responseTime}s`}
                  accent="orange"
                />
              </div>

              <div className="mx-5 mb-5 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-pink-50/60 p-4 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-pink-950/10">

                <div className="flex items-center justify-between gap-3">

                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      AI vs human
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Conversation handling
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Bot
                      size={16}
                      className="text-violet-600 dark:text-violet-400"
                    />
                  </div>
                </div>

                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                    style={{
                      width: `${aiRate}%`,
                    }}
                  />

                  <div
                    className="h-full bg-slate-300 transition-all duration-500 dark:bg-slate-600"
                    style={{
                      width: `${humanRate}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-semibold">

                  <span className="text-violet-600 dark:text-violet-400">
                    AI {aiRate}%
                  </span>

                  <span className="text-slate-500 dark:text-slate-400">
                    Human {humanRate}%
                  </span>
                </div>
              </div>
            </section>

            {/* Customers */}

            <section className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm shadow-pink-500/5 dark:border-surface-700 dark:bg-surface-900">

              <div className="border-b border-pink-50 bg-gradient-to-r from-pink-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-pink-950/20">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                    <Users
                      size={14}
                      className="text-pink-600 dark:text-pink-400"
                    />
                  </div>

                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Customer activity
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Customer mix during this period
                </p>
              </div>

              <div className="p-5">

                <div className="grid grid-cols-3 gap-3">

                  <CustomerMetric
                    icon={Users}
                    label="New"
                    value={data.customers.new}
                    accent="blue"
                  />

                  <CustomerMetric
                    icon={UserRound}
                    label="Returning"
                    value={data.customers.returning}
                    accent="violet"
                  />

                  <CustomerMetric
                    icon={Sparkles}
                    label="VIP"
                    value={data.customers.vip}
                    accent="amber"
                  />
                </div>

                <div className="mt-5 rounded-xl border border-pink-100 bg-gradient-to-br from-pink-50/70 to-violet-50/60 p-4 dark:border-pink-900/30 dark:from-pink-950/10 dark:to-violet-950/10">

                  <div className="flex items-center justify-between gap-3">

                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Returning customer ratio
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Returning customers compared with new customers
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                      <ArrowUpRight
                        size={16}
                        className="text-pink-600 dark:text-pink-400"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-end gap-2">

                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      {(
                        (data.customers.returning /
                          Math.max(
                            data.customers.new,
                            1
                          )) *
                        100
                      ).toFixed(1)}
                      %
                    </p>

                    <span className="pb-1 text-[10px] font-medium text-slate-400">
                      returning / new
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              HANDOFFS + KNOWLEDGE GAPS
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-2">

            {/* Handoffs */}

            <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm shadow-blue-500/5 dark:border-surface-700 dark:bg-surface-900">

              <div className="flex items-center justify-between border-b border-blue-50 bg-gradient-to-r from-blue-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-blue-950/20">

                <div>
                  <div className="flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <UserRound
                        size={14}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Human handoffs
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Conversations requiring a human
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <UserRound
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>

              <div className="p-5">

                <div className="flex items-end justify-between gap-4">

                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {data.handoffs.toLocaleString()}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Total handoffs
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {handoffRate}% of conversations
                  </span>
                </div>

                <div className="mt-5 space-y-4">

                  {data.handoffReasons.map(
                    (reason, index) => {
                      const maxValue = Math.max(
                        ...data.handoffReasons.map(
                          (item) => item.value
                        )
                      );

                      const percentage =
                        maxValue > 0
                          ? (reason.value /
                              maxValue) *
                            100
                          : 0;

                      const barColors = [
                        "bg-blue-500",
                        "bg-violet-500",
                        "bg-pink-500",
                        "bg-orange-500",
                        "bg-emerald-500",
                      ];

                      return (
                        <div key={reason.name}>

                          <div className="mb-1.5 flex items-center justify-between gap-3">

                            <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {reason.name}
                            </span>

                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              {reason.value}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                            <div
                              className={`h-full rounded-full ${barColors[index % barColors.length]}`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* Knowledge gaps */}

            <section className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm shadow-amber-500/5 dark:border-surface-700 dark:bg-surface-900">

              <div className="flex items-center justify-between border-b border-amber-50 bg-gradient-to-r from-amber-50/70 to-transparent px-5 py-4 dark:border-surface-700 dark:from-amber-950/20">

                <div>
                  <div className="flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Sparkles
                        size={14}
                        className="text-amber-600 dark:text-amber-400"
                      />
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      AI knowledge gaps
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Questions the AI could not answer confidently
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <AlertTriangle
                    size={16}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">

                {visibleKnowledgeGaps.map(
                  (gap) => (
                    <div
                      key={gap.question}
                      className="flex items-start gap-3 px-5 py-4 transition hover:bg-amber-50/40 dark:hover:bg-amber-950/10"
                    >

                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                        <MessageSquare
                          size={13}
                          className="text-amber-600 dark:text-amber-400"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-xs font-semibold leading-5 text-slate-700 dark:text-slate-300">
                          {gap.question}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          Asked {gap.count}{" "}
                          {gap.count === 1
                            ? "time"
                            : "times"}
                        </p>
                      </div>

                      <AlertTriangle
                        size={14}
                        className="mt-1 shrink-0 text-amber-500"
                      />
                    </div>
                  )
                )}
              </div>

              {data.knowledgeGaps.length > 3 && (
                <div className="border-t border-amber-100 px-5 py-3 dark:border-surface-700">

                  <button
                    type="button"
                    onClick={() =>
                      setShowAllGaps(
                        (value) => !value
                      )
                    }
                    className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40"
                  >
                    {showAllGaps
                      ? "Show less"
                      : `View all ${data.knowledgeGaps.length} gaps`}
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

/* =========================================================
   METRIC CARD
========================================================= */

const MetricCard = ({
  icon: Icon,
  title,
  value,
  change,
  positive,
  description,
  accent = "primary",
}) => {
  const accentMap = {
    info: {
      iconBg:
        "bg-blue-100 dark:bg-blue-900/30",
      iconColor:
        "text-blue-600 dark:text-blue-400",
      border:
        "border-blue-200 dark:border-blue-900/50",
      top:
        "from-blue-500 to-cyan-500",
      shadow:
        "shadow-blue-500/10",
    },

    ai: {
      iconBg:
        "bg-violet-100 dark:bg-violet-900/30",
      iconColor:
        "text-violet-600 dark:text-violet-400",
      border:
        "border-violet-200 dark:border-violet-900/50",
      top:
        "from-violet-500 to-purple-600",
      shadow:
        "shadow-violet-500/10",
    },

    social: {
      iconBg:
        "bg-pink-100 dark:bg-pink-900/30",
      iconColor:
        "text-pink-600 dark:text-pink-400",
      border:
        "border-pink-200 dark:border-pink-900/50",
      top:
        "from-pink-500 to-rose-500",
      shadow:
        "shadow-pink-500/10",
    },

    order: {
      iconBg:
        "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor:
        "text-emerald-600 dark:text-emerald-400",
      border:
        "border-emerald-200 dark:border-emerald-900/50",
      top:
        "from-emerald-500 to-teal-500",
      shadow:
        "shadow-emerald-500/10",
    },

    primary: {
      iconBg:
        "bg-violet-100 dark:bg-violet-900/30",
      iconColor:
        "text-violet-600 dark:text-violet-400",
      border:
        "border-violet-200 dark:border-violet-900/50",
      top:
        "from-violet-500 to-purple-600",
      shadow:
        "shadow-violet-500/10",
    },

    success: {
      iconBg:
        "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor:
        "text-emerald-600 dark:text-emerald-400",
      border:
        "border-emerald-200 dark:border-emerald-900/50",
      top:
        "from-emerald-500 to-teal-500",
      shadow:
        "shadow-emerald-500/10",
    },

    warning: {
      iconBg:
        "bg-orange-100 dark:bg-orange-900/30",
      iconColor:
        "text-orange-600 dark:text-orange-400",
      border:
        "border-orange-200 dark:border-orange-900/50",
      top:
        "from-orange-500 to-amber-500",
      shadow:
        "shadow-orange-500/10",
    },
  };

  const accentStyles =
    accentMap[accent] || accentMap.primary;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${accentStyles.border} ${accentStyles.shadow} dark:bg-surface-900 sm:p-5`}
    >

      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentStyles.top}`}
      />

      <div className="flex items-center justify-between gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentStyles.iconBg}`}
        >
          <Icon
            size={18}
            className={accentStyles.iconColor}
          />
        </div>

        <div
          className={`
            flex items-center gap-1
            rounded-full px-2 py-1
            text-[10px] font-bold
            ${
              positive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
            }
          `}
        >
          {positive ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}

          {change}%
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-1 truncate text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-slate-400">
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   LINE CHART
========================================================= */

const SimpleLineChart = ({ values }) => {
  const width = 900;
  const height = 280;

  const paddingLeft = 20;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 32;

  const min = Math.min(...values);
  const max = Math.max(...values);

  const range =
    max - min === 0 ? 1 : max - min;

  const points = values.map(
    (value, index) => {
      const x =
        paddingLeft +
        (index /
          Math.max(values.length - 1, 1)) *
          (width -
            paddingLeft -
            paddingRight);

      const y =
        height -
        paddingBottom -
        ((value - min) / range) *
          (height -
            paddingTop -
            paddingBottom);

      return `${x},${y}`;
    }
  );

  const areaPoints = [
    `${paddingLeft},${height - paddingBottom}`,
    ...points,
    `${width - paddingRight},${height - paddingBottom}`,
  ].join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[260px] w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Conversation trend chart"
      >

        <defs>
          <linearGradient
            id="analyticsAreaGradient"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#8b5cf6"
              stopOpacity="0.25"
            />

            <stop
              offset="100%"
              stopColor="#ec4899"
              stopOpacity="0.02"
            />
          </linearGradient>

          <linearGradient
            id="analyticsLineGradient"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#8b5cf6"
            />

            <stop
              offset="100%"
              stopColor="#ec4899"
            />
          </linearGradient>
        </defs>

        {/* Horizontal grid */}

        {[0, 1, 2, 3].map((line) => {
          const y =
            paddingTop +
            (line / 3) *
              (height -
                paddingTop -
                paddingBottom);

          return (
            <line
              key={line}
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4 5"
            />
          );
        })}

        {/* Area */}

        <polygon
          points={areaPoints}
          fill="url(#analyticsAreaGradient)"
        />

        {/* Line */}

        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="url(#analyticsLineGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}

        {values.map((value, index) => {
          const [x, y] = points[index]
            .split(",")
            .map(Number);

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="white"
                stroke="#8b5cf6"
                strokeWidth="3"
              />

              <circle
                cx={x}
                cy={y}
                r="2.5"
                fill="#ec4899"
              />
            </g>
          );
        })}

        <text
          x={paddingLeft}
          y={height - 8}
          fontSize="10"
          fill="#94a3b8"
        >
          Start
        </text>

        <text
          x={width - paddingRight}
          y={height - 8}
          fontSize="10"
          fill="#94a3b8"
          textAnchor="end"
        >
          Now
        </text>
      </svg>
    </div>
  );
};

/* =========================================================
   FUNNEL STEP
========================================================= */

const FunnelStep = ({
  number,
  label,
  value,
  icon: Icon,
  accent = "violet",
  last = false,
}) => {
  const accents = {
    violet: {
      bg: "bg-violet-100 dark:bg-violet-900/30",
      icon: "text-violet-600 dark:text-violet-400",
      number: "text-violet-500",
    },

    pink: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      icon: "text-pink-600 dark:text-pink-400",
      number: "text-pink-500",
    },

    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      icon: "text-orange-600 dark:text-orange-400",
      number: "text-orange-500",
    },

    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      number: "text-emerald-500",
    },
  };

  const style =
    accents[accent] || accents.violet;

  return (
    <div
      className={`
        flex items-center gap-4 p-5
        transition hover:bg-slate-50 dark:hover:bg-slate-800/40
        md:items-start
        ${
          !last
            ? "border-b border-slate-100 md:border-b-0 md:border-r dark:border-slate-700"
            : ""
        }
      `}
    >

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}
      >
        <Icon
          size={17}
          className={style.icon}
        />
      </div>

      <div className="min-w-0">

        <div className="flex items-center gap-2">

          <span
            className={`text-[10px] font-bold ${style.number}`}
          >
            {number}
          </span>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>

        <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   MINI METRIC
========================================================= */

const MiniMetric = ({
  icon: Icon,
  label,
  value,
  accent = "violet",
}) => {
  const accents = {
    violet: {
      bg: "bg-violet-100 dark:bg-violet-900/30",
      icon: "text-violet-600 dark:text-violet-400",
      border: "border-violet-100 dark:border-violet-900/40",
    },

    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      icon: "text-blue-600 dark:text-blue-400",
      border: "border-blue-100 dark:border-blue-900/40",
    },

    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/40",
    },

    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      icon: "text-orange-600 dark:text-orange-400",
      border: "border-orange-100 dark:border-orange-900/40",
    },
  };

  const style =
    accents[accent] || accents.violet;

  return (
    <div
      className={`rounded-xl border ${style.border} bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-surface-900`}
    >
      <div className="flex items-center gap-2">

        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${style.bg}`}
        >
          <Icon
            size={14}
            className={style.icon}
          />
        </div>

        <p className="text-[10px] font-semibold text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   CUSTOMER METRIC
========================================================= */

const CustomerMetric = ({
  icon: Icon,
  label,
  value,
  accent = "blue",
}) => {
  const accents = {
    blue: {
      wrapper:
        "bg-blue-50 dark:bg-blue-950/20",
      iconBg:
        "bg-blue-100 dark:bg-blue-900/30",
      icon:
        "text-blue-600 dark:text-blue-400",
      value:
        "text-blue-700 dark:text-blue-300",
    },

    violet: {
      wrapper:
        "bg-violet-50 dark:bg-violet-950/20",
      iconBg:
        "bg-violet-100 dark:bg-violet-900/30",
      icon:
        "text-violet-600 dark:text-violet-400",
      value:
        "text-violet-700 dark:text-violet-300",
    },

    amber: {
      wrapper:
        "bg-amber-50 dark:bg-amber-950/20",
      iconBg:
        "bg-amber-100 dark:bg-amber-900/30",
      icon:
        "text-amber-600 dark:text-amber-400",
      value:
        "text-amber-700 dark:text-amber-300",
    },
  };

  const style =
    accents[accent] || accents.blue;

  return (
    <div
      className={`rounded-xl p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md ${style.wrapper}`}
    >

      <div
        className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${style.iconBg}`}
      >
        <Icon
          size={15}
          className={style.icon}
        />
      </div>

      <p
        className={`mt-3 text-lg font-bold ${style.value}`}
      >
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-[10px] font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
};

export default Analytics;