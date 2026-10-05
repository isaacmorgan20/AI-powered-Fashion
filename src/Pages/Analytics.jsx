import { useMemo, useState } from "react";
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
  MessageCircle,
  Globe2,
  CheckCircle2,
  UserRound,
  Sparkles,
  Package,
  Loader2,
  AlertCircle,
  WifiOff,
} from "lucide-react";

import { useAnalytics } from "../hooks/useAnalytics";
import { useSettings } from "../hooks/useSettings";

import {
  Select,
  SocialIcon,
} from "../Components/ui";

/* =========================================================
   CHANNEL ICON
========================================================= */

const ChannelIcon = ({ name }) => {
  const norm = String(name || "").toLowerCase();

  let bgStyle = "bg-slate-50 ring-slate-200";

  if (norm.includes("whatsapp")) {
    bgStyle = "bg-emerald-50 ring-emerald-100";
  } else if (norm.includes("instagram")) {
    bgStyle = "bg-slate-50 ring-slate-200";
  } else if (norm.includes("facebook")) {
    bgStyle = "bg-blue-50 ring-blue-100";
  } else if (norm.includes("telegram")) {
    bgStyle = "bg-sky-50 ring-sky-100";
  } else if (norm.includes("website")) {
    bgStyle = "bg-primary/5 ring-primary/10";
  }

  return (
    <div
      className={`
        flex h-10 w-10 shrink-0 items-center justify-center
        rounded-xl ring-1
        ${bgStyle}
      `}
    >
      <SocialIcon name={name} size={19} />
    </div>
  );
};

/* =========================================================
   ANALYTICS PAGE
========================================================= */

const Analytics = () => {
  const [range, setRange] = useState("30 days");
  const [showAllGaps, setShowAllGaps] = useState(false);

  const { data, loading, error, refetch, isUsingCache, isOnline } = useAnalytics(range);
  const { settings } = useSettings();

  const currency = settings?.general?.currency || "GHS";

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const aiRate = useMemo(() => {
    if (!data?.conversations) return "0.0";

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
    if (!data?.funnel?.conversations) return "0.0";

    return (
      (data.funnel.completedOrders /
        data.funnel.conversations) *
      100
    ).toFixed(1);
  }, [data]);

  const handoffRate = useMemo(() => {
    if (!data?.conversations) return "0.0";

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

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-surface-primary p-6">
        <div className="w-full max-w-sm rounded-2xl border border-border-light bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Loader2
              size={23}
              className="animate-spin text-primary"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-text-primary">
            Loading analytics...
          </p>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            Preparing your business insights
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  const isOfflineError = error?.startsWith?.('Offline');

  if (error && (!isOfflineError || !data)) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-surface-primary p-6">
        <div className="w-full max-w-sm rounded-2xl border border-error/20 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-error/10">
            <AlertCircle
              size={24}
              className="text-error"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-text-primary">
            Failed to load analytics
          </h3>

          <p className="mt-2 text-xs leading-5 text-text-muted">
            {error}
          </p>

          <button
            type="button"
            onClick={refetch}
            className="
              mt-5 rounded-lg
              bg-primary px-4 py-2
              text-xs font-semibold text-white
              shadow-sm
              transition-colors
              hover:bg-primary/90
            "
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO DATA (offline with no cache, or truly empty)
  ======================================================= */

  if (!data) {
    const isOfflineNoCache = isOfflineError && !isOnline;
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-surface-primary p-6">
        <div className="w-full max-w-sm rounded-2xl border border-border-light bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            {isOfflineNoCache ? (
              <WifiOff size={25} className="text-primary" />
            ) : (
              <BarChart3 size={25} className="text-primary" />
            )}
          </div>

          <p className="mt-4 text-sm font-semibold text-text-primary">
            {isOfflineNoCache ? "You're offline" : "No analytics data"}
          </p>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            {isOfflineNoCache
              ? "Analytics will appear here after your first successful connection."
              : "There is currently no data available for this period."}
          </p>

          {isOfflineNoCache && (
            <button
              type="button"
              onClick={refetch}
              className="
                mt-5 rounded-lg
                bg-primary px-4 py-2
                text-xs font-semibold text-white
                shadow-sm
                transition-colors
                hover:bg-primary/90
              "
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="
        flex h-full min-h-0 w-full flex-col
        overflow-hidden
        bg-surface-primary
      "
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <header className="z-10 shrink-0 border-b border-border-light bg-white">
        <div className="px-4 py-4 sm:px-6 lg:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                  <BarChart3
                    size={20}
                    strokeWidth={2}
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-lg font-bold tracking-tight text-text-primary">
                    Analytics
                  </h1>

                  <p className="mt-0.5 text-xs text-text-muted">
                    Track customer engagement, sales and AI performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full shrink-0 sm:w-auto">
              <Select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                options={[
                  {
                    value: "Today",
                    label: "Today",
                  },
                  {
                    value: "7 days",
                    label: "7 days",
                  },
                  {
                    value: "30 days",
                    label: "30 days",
                  },
                  {
                    value: "90 days",
                    label: "90 days",
                  },
                ]}
                className="w-full sm:w-[150px]"
              />
            </div>
          </div>
        </div>
      </header>

      {isUsingCache && !isOnline && (
        <div className="flex items-center justify-center gap-2 border-b border-warning/30 bg-warning/5 px-4 py-2.5 text-xs font-medium text-warning">
          <WifiOff size={12} className="shrink-0" />
          <span>Offline — Showing saved data</span>
        </div>
      )}

      {/* ===================================================
          SCROLLABLE CONTENT AREA
      ==================================================== */}

      <main
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          touch-pan-y
          overscroll-y-auto
          [scrollbar-gutter:stable]
        "
      >
        <div className="mx-auto w-full max-w-[1800px] space-y-5 p-4 pb-8 sm:p-5 sm:pb-10 lg:p-6 lg:pb-12">

          {/* =================================================
              KPI CARDS
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
              accent="primary"
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
              accent="success"
            />
          </div>

          {/* =================================================
              REVENUE / CONVERSATIONS + CUSTOMER INTENT
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

            {/* Conversation Trend */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="flex flex-col gap-3 border-b border-border-light px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">
                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp
                        size={15}
                        className="text-primary"
                      />
                    </div>

                    <h2 className="text-sm font-semibold text-text-primary">
                      Conversation overview
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-text-muted">
                    Customer conversations over time
                  </p>
                </div>

                <span className="w-fit rounded-lg border border-border-light bg-surface-muted px-2.5 py-1.5 text-[10px] font-semibold text-text-secondary">
                  {range}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <SimpleLineChart
                  values={data.conversationChart}
                />
              </div>
            </section>

            {/* Customer Intent */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="border-b border-border-light px-5 py-4">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MessageCircle
                      size={15}
                      className="text-primary"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-text-primary">
                    Customer intent
                  </h2>
                </div>

                <p className="mt-1 text-xs text-text-muted">
                  What customers ask about most
                </p>
              </div>

              <div className="space-y-5 p-5">
                {data.intents.map((intent, index) => {
                  const intentColors = [
                    "bg-primary",
                    "bg-info",
                    "bg-success",
                    "bg-warning",
                    "bg-slate-400",
                  ];

                  return (
                    <div key={intent.name}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">

                        <span className="truncate text-xs font-semibold text-text-secondary">
                          {intent.name}
                        </span>

                        <span className="shrink-0 text-[10px] font-semibold text-text-muted">
                          {intent.value}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className={`
                            h-full rounded-full
                            ${intentColors[index % intentColors.length]}
                            transition-all duration-500
                          `}
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

          <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-border-light px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <ShoppingBag
                      size={15}
                      className="text-primary"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-text-primary">
                    Conversation → Purchase
                  </h2>
                </div>

                <p className="mt-1 text-xs text-text-muted">
                  How customer conversations move toward completed orders
                </p>
              </div>

              <div className="w-fit rounded-lg bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                {conversionRate}% conversion
              </div>
            </div>

            <div className="grid md:grid-cols-4">

              <FunnelStep
                number="01"
                label="Conversations"
                value={data.funnel.conversations}
                icon={MessageSquare}
                accent="primary"
              />

              <FunnelStep
                number="02"
                label="Product interest"
                value={data.funnel.productInterest}
                icon={ShoppingBag}
                accent="info"
              />

              <FunnelStep
                number="03"
                label="Order attempts"
                value={data.funnel.orderAttempts}
                icon={Package}
                accent="warning"
              />

              <FunnelStep
                number="04"
                label="Completed orders"
                value={data.funnel.completedOrders}
                icon={CheckCircle2}
                accent="success"
                last
              />
            </div>
          </section>

          {/* =================================================
              PRODUCTS + CHANNELS
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-2">

            {/* Top Products */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-border-light px-5 py-4">

                <div>
                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                      <Package
                        size={15}
                        className="text-warning"
                      />
                    </div>

                    <h2 className="text-sm font-semibold text-text-primary">
                      Top products
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-text-muted">
                    Products generating the most interest
                  </p>
                </div>

                <Package
                  size={18}
                  className="text-text-muted"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">

                  <thead>
                    <tr className="border-b border-border-light bg-surface-muted">

                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        Product
                      </th>

                      <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        Enquiries
                      </th>

                      <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        Orders
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border-light">

                    {data.topProducts.map(
                      (product, index) => (
                        <tr
                          key={product.name}
                          className="transition-colors hover:bg-surface-muted/60"
                        >
                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className={`
                                  flex h-9 w-9 shrink-0
                                  items-center justify-center
                                  rounded-lg
                                  text-xs font-bold
                                  ${
                                    index === 0
                                      ? "bg-primary/10 text-primary"
                                      : index === 1
                                      ? "bg-info/10 text-info"
                                      : index === 2
                                      ? "bg-warning/10 text-warning"
                                      : "bg-surface-muted text-text-muted"
                                  }
                                `}
                              >
                                {index + 1}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-text-primary">
                                  {product.name}
                                </p>

                                <p className="mt-0.5 text-[10px] text-text-muted">
                                  Product interest
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4 text-right text-xs font-medium text-text-secondary">
                            {product.enquiries.toLocaleString()}
                          </td>

                          <td className="px-3 py-4 text-right text-xs font-medium text-text-secondary">
                            {product.orders.toLocaleString()}
                          </td>

                          <td className="px-5 py-4 text-right text-xs font-semibold text-success">
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

            {/* Channel Performance */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="border-b border-border-light px-5 py-4">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Globe2
                      size={15}
                      className="text-primary"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-text-primary">
                    Channel performance
                  </h2>
                </div>

                <p className="mt-1 text-xs text-text-muted">
                  Where customer conversations originate
                </p>
              </div>

              <div className="divide-y divide-border-light">

                {data.channels.map((channel) => (
                  <div
                    key={channel.name}
                    className="px-5 py-4 transition-colors hover:bg-surface-muted/50"
                  >
                    <div className="flex items-center gap-3">

                      <ChannelIcon
                        name={channel.name}
                      />

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <p className="text-xs font-semibold text-text-primary">
                            {channel.name}
                          </p>

                          <p className="text-xs font-semibold text-primary">
                            {channel.value}%
                          </p>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">

                          <div
                            className={`
                              h-full rounded-full
                              ${
                                String(channel.name)
                                  .toLowerCase()
                                  .includes("whatsapp")
                                  ? "bg-emerald-500"
                                  : String(channel.name)
                                      .toLowerCase()
                                      .includes("facebook")
                                  ? "bg-blue-500"
                                  : String(channel.name)
                                      .toLowerCase()
                                      .includes("telegram")
                                  ? "bg-sky-500"
                                  : "bg-primary"
                              }
                            `}
                            style={{
                              width: `${channel.value}%`,
                            }}
                          />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-text-muted">

                          <span>
                            {channel.conversations.toLocaleString()} conversations
                          </span>

                          <span>
                            {channel.orders.toLocaleString()} orders
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

            {/* AI Performance */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="border-b border-border-light px-5 py-4">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles
                      size={15}
                      className="text-primary"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-text-primary">
                    AI performance
                  </h2>
                </div>

                <p className="mt-1 text-xs text-text-muted">
                  How the AI is handling customer conversations
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">

                <MiniMetric
                  icon={Bot}
                  label="AI handled"
                  value={data.aiResolved.toLocaleString()}
                  accent="primary"
                />

                <MiniMetric
                  icon={UserRound}
                  label="Human handled"
                  value={(
                    data.conversations -
                    data.aiResolved
                  ).toLocaleString()}
                  accent="info"
                />

                <MiniMetric
                  icon={CheckCircle2}
                  label="Resolution rate"
                  value={`${aiRate}%`}
                  accent="success"
                />

                <MiniMetric
                  icon={Clock3}
                  label="Avg. response"
                  value={`${data.responseTime}s`}
                  accent="warning"
                />
              </div>

              <div className="mx-5 mb-5 rounded-xl border border-border-light bg-surface-muted/50 p-4">

                <div className="flex items-center justify-between gap-3">

                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      AI vs human
                    </p>

                    <p className="mt-1 text-[10px] text-text-muted">
                      Conversation handling
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Bot
                      size={16}
                      className="text-primary"
                    />
                  </div>
                </div>

                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-200">

                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${aiRate}%`,
                    }}
                  />

                  <div
                    className="h-full bg-slate-300 transition-all duration-500"
                    style={{
                      width: `${humanRate}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-semibold">

                  <span className="text-primary">
                    AI {aiRate}%
                  </span>

                  <span className="text-text-muted">
                    Human {humanRate}%
                  </span>
                </div>
              </div>
            </section>

            {/* Customer Activity */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="border-b border-border-light px-5 py-4">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                    <Users
                      size={15}
                      className="text-info"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-text-primary">
                    Customer activity
                  </h2>
                </div>

                <p className="mt-1 text-xs text-text-muted">
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
                    accent="primary"
                  />

                  <CustomerMetric
                    icon={Sparkles}
                    label="VIP"
                    value={data.customers.vip}
                    accent="amber"
                  />
                </div>

                <div className="mt-5 rounded-xl border border-border-light bg-surface-muted/50 p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div>
                      <p className="text-xs font-semibold text-text-primary">
                        Returning customer ratio
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-text-muted">
                        Returning customers compared with new customers
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ArrowUpRight
                        size={16}
                        className="text-primary"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-end gap-2">

                    <p className="text-2xl font-bold text-primary">
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

                    <span className="pb-1 text-[10px] font-medium text-text-muted">
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

            {/* Human Handoffs */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-border-light px-5 py-4">

                <div>
                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                      <UserRound
                        size={15}
                        className="text-info"
                      />
                    </div>

                    <h2 className="text-sm font-semibold text-text-primary">
                      Human handoffs
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-text-muted">
                    Conversations requiring a human
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info/10">
                  <UserRound
                    size={16}
                    className="text-info"
                  />
                </div>
              </div>

              <div className="p-5">

                <div className="flex items-end justify-between gap-4">

                  <div>
                    <p className="text-2xl font-bold text-text-primary">
                      {data.handoffs.toLocaleString()}
                    </p>

                    <p className="mt-1 text-[10px] text-text-muted">
                      Total handoffs
                    </p>
                  </div>

                  <span className="rounded-lg bg-info/10 px-2.5 py-1 text-[10px] font-semibold text-info">
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
                        "bg-primary",
                        "bg-info",
                        "bg-warning",
                        "bg-success",
                        "bg-slate-400",
                      ];

                      return (
                        <div key={reason.name}>

                          <div className="mb-1.5 flex items-center justify-between gap-3">

                            <span className="truncate text-xs font-semibold text-text-secondary">
                              {reason.name}
                            </span>

                            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                              {reason.value}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">

                            <div
                              className={`
                                h-full rounded-full
                                ${barColors[index % barColors.length]}
                              `}
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

            {/* Knowledge Gaps */}

            <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-border-light px-5 py-4">

                <div>
                  <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                      <Sparkles
                        size={15}
                        className="text-warning"
                      />
                    </div>

                    <h2 className="text-sm font-semibold text-text-primary">
                      AI knowledge gaps
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-text-muted">
                    Questions the AI could not answer confidently
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
                  <AlertTriangle
                    size={16}
                    className="text-warning"
                  />
                </div>
              </div>

              <div className="divide-y divide-border-light">

                {visibleKnowledgeGaps.map(
                  (gap) => (
                    <div
                      key={gap.question}
                      className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/50"
                    >

                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                        <MessageSquare
                          size={13}
                          className="text-warning"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-xs font-semibold leading-5 text-text-secondary">
                          {gap.question}
                        </p>

                        <p className="mt-1 text-[10px] text-text-muted">
                          Asked {gap.count}{" "}
                          {gap.count === 1
                            ? "time"
                            : "times"}
                        </p>
                      </div>

                      <AlertTriangle
                        size={14}
                        className="mt-1 shrink-0 text-warning"
                      />
                    </div>
                  )
                )}
              </div>

              {data.knowledgeGaps.length > 3 && (
                <div className="border-t border-border-light px-5 py-3">

                  <button
                    type="button"
                    onClick={() =>
                      setShowAllGaps(
                        (value) => !value
                      )
                    }
                    className="
                      rounded-lg
                      border border-border-light
                      bg-white
                      px-3 py-2
                      text-xs font-semibold
                      text-primary
                      transition-colors
                      hover:bg-primary/5
                    "
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
      iconBg: "bg-info/10",
      iconColor: "text-info",
      border: "border-border-light",
      top: "bg-info",
    },

    primary: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      border: "border-border-light",
      top: "bg-primary",
    },

    success: {
      iconBg: "bg-success/10",
      iconColor: "text-success",
      border: "border-border-light",
      top: "bg-success",
    },

    warning: {
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      border: "border-border-light",
      top: "bg-warning",
    },

    error: {
      iconBg: "bg-error/10",
      iconColor: "text-error",
      border: "border-border-light",
      top: "bg-error",
    },
  };

  const accentStyles =
    accentMap[accent] || accentMap.primary;

  return (
    <div
      className={`
        group relative overflow-hidden
        rounded-2xl
        border ${accentStyles.border}
        bg-white
        p-4
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        sm:p-5
      `}
    >
      <div
        className={`
          absolute inset-x-0 top-0 h-0.5
          ${accentStyles.top}
        `}
      />

      <div className="flex items-center justify-between gap-3">

        <div
          className={`
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            ${accentStyles.iconBg}
          `}
        >
          <Icon
            size={18}
            className={accentStyles.iconColor}
          />
        </div>

        <div
          className={`
            flex items-center gap-1
            rounded-full
            px-2 py-1
            text-[10px] font-semibold
            ${
              positive
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
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

      <p className="mt-4 text-xs font-medium text-text-muted">
        {title}
      </p>

      <p className="mt-1 truncate text-2xl font-bold tracking-tight text-text-primary">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-text-muted">
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   LINE CHART
========================================================= */

const SimpleLineChart = ({ values }) => {
  const safeValues = Array.isArray(values)
    ? values
    : [];

  if (!safeValues.length) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-border-light bg-surface-muted/40">
        <div className="text-center">
          <BarChart3
            size={22}
            className="mx-auto text-text-muted"
          />

          <p className="mt-2 text-xs font-medium text-text-secondary">
            No conversation trend data
          </p>

          <p className="mt-1 text-[10px] text-text-muted">
            More activity will appear here as conversations arrive.
          </p>
        </div>
      </div>
    );
  }

  const width = 900;
  const height = 280;

  const paddingLeft = 20;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 32;

  const min = Math.min(...safeValues);
  const max = Math.max(...safeValues);

  const chartRange =
    max - min === 0 ? 1 : max - min;

  const points = safeValues.map(
    (value, index) => {
      const x =
        paddingLeft +
        (index /
          Math.max(
            safeValues.length - 1,
            1
          )) *
          (width -
            paddingLeft -
            paddingRight);

      const y =
        height -
        paddingBottom -
        ((value - min) /
          chartRange) *
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
        {/* Grid */}

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
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="4 5"
            />
          );
        })}

        {/* Area */}

        <polygon
          points={areaPoints}
          fill="rgba(37, 99, 235, 0.07)"
        />

        {/* Line */}

        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}

        {safeValues.map(
          (value, index) => {
            const [x, y] = points[index]
              .split(",")
              .map(Number);

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="white"
                  stroke="#2563EB"
                  strokeWidth="2"
                />

                <circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#2563EB"
                />
              </g>
            );
          }
        )}

        <text
          x={paddingLeft}
          y={height - 8}
          fontSize="10"
          fill="#94A3B8"
        >
          Start
        </text>

        <text
          x={width - paddingRight}
          y={height - 8}
          fontSize="10"
          fill="#94A3B8"
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
  accent = "primary",
  last = false,
}) => {
  const accents = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      number: "text-primary",
    },

    info: {
      bg: "bg-info/10",
      icon: "text-info",
      number: "text-info",
    },

    warning: {
      bg: "bg-warning/10",
      icon: "text-warning",
      number: "text-warning",
    },

    success: {
      bg: "bg-success/10",
      icon: "text-success",
      number: "text-success",
    },
  };

  const style =
    accents[accent] || accents.primary;

  return (
    <div
      className={`
        flex items-center gap-4
        p-5
        transition-colors
        hover:bg-surface-muted/50
        md:items-start
        ${
          !last
            ? "border-b border-border-light md:border-b-0 md:border-r"
            : ""
        }
      `}
    >
      <div
        className={`
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          ${style.bg}
        `}
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

          <p className="truncate text-xs font-medium text-text-muted">
            {label}
          </p>
        </div>

        <p className="mt-1 text-xl font-bold text-text-primary">
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
  accent = "primary",
}) => {
  const accents = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      border: "border-border-light",
    },

    info: {
      bg: "bg-info/10",
      icon: "text-info",
      border: "border-border-light",
    },

    success: {
      bg: "bg-success/10",
      icon: "text-success",
      border: "border-border-light",
    },

    warning: {
      bg: "bg-warning/10",
      icon: "text-warning",
      border: "border-border-light",
    },
  };

  const style =
    accents[accent] || accents.primary;

  return (
    <div
      className={`
        rounded-xl
        border ${style.border}
        bg-white
        p-4
        transition
        hover:-translate-y-0.5
        hover:shadow-sm
      `}
    >
      <div className="flex items-center gap-2">

        <div
          className={`
            flex h-7 w-7
            items-center justify-center
            rounded-lg
            ${style.bg}
          `}
        >
          <Icon
            size={14}
            className={style.icon}
          />
        </div>

        <p className="text-[10px] font-medium text-text-muted">
          {label}
        </p>
      </div>

      <p className="mt-3 text-lg font-bold text-text-primary">
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
      wrapper: "bg-blue-50",
      iconBg: "bg-blue-100",
      icon: "text-blue-600",
      value: "text-blue-700",
    },

    primary: {
      wrapper: "bg-primary/5",
      iconBg: "bg-primary/10",
      icon: "text-primary",
      value: "text-primary",
    },

    amber: {
      wrapper: "bg-amber-50",
      iconBg: "bg-amber-100",
      icon: "text-amber-600",
      value: "text-amber-700",
    },
  };

  const style =
    accents[accent] || accents.blue;

  return (
    <div
      className={`
        rounded-xl
        p-4
        text-center
        transition
        hover:-translate-y-0.5
        hover:shadow-sm
        ${style.wrapper}
      `}
    >
      <div
        className={`
          mx-auto flex h-8 w-8
          items-center justify-center
          rounded-lg
          ${style.iconBg}
        `}
      >
        <Icon
          size={15}
          className={style.icon}
        />
      </div>

      <p
        className={`
          mt-3 text-lg font-bold
          ${style.value}
        `}
      >
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-[10px] font-medium text-text-muted">
        {label}
      </p>
    </div>
  );
};

export default Analytics;