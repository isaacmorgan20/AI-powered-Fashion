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
} from "lucide-react";

/* =========================================================
   DEMO ANALYTICS DATA
========================================================= */

const analyticsData = {
  Today: {
    conversations: 84,
    conversationsChange: 8.4,
    aiResolved: 69,
    aiResolvedChange: 4.1,
    responseTime: 31,
    responseTimeChange: -12,
    revenue: 1850,
    revenueChange: 14.8,

    conversationChart: [
      12, 18, 14, 22, 19, 28, 24, 31, 27, 35, 32, 38,
    ],

    intents: [
      { name: "Price", value: 34 },
      { name: "Size", value: 22 },
      { name: "Availability", value: 18 },
      { name: "Delivery", value: 14 },
      { name: "Order status", value: 8 },
      { name: "Other", value: 4 },
    ],

    topProducts: [
      {
        name: "Black Evening Dress",
        enquiries: 23,
        orders: 8,
        revenue: 3600,
      },
      {
        name: "Silk Dress",
        enquiries: 17,
        orders: 6,
        revenue: 5400,
      },
      {
        name: "Gold Heels",
        enquiries: 12,
        orders: 4,
        revenue: 2200,
      },
      {
        name: "Blue Kaftan",
        enquiries: 9,
        orders: 3,
        revenue: 1500,
      },
    ],

    channels: [
      {
        name: "WhatsApp",
        value: 52,
        conversations: 44,
        orders: 14,
        revenue: 920,
      },
      {
        name: "Instagram",
        value: 28,
        conversations: 24,
        orders: 9,
        revenue: 540,
      },
      {
        name: "Website",
        value: 15,
        conversations: 12,
        orders: 5,
        revenue: 290,
      },
      {
        name: "Facebook",
        value: 5,
        conversations: 4,
        orders: 2,
        revenue: 100,
      },
    ],

    handoffs: 15,

    handoffReasons: [
      {
        name: "Customer requested agent",
        value: 5,
      },
      {
        name: "Order problem",
        value: 4,
      },
      {
        name: "Complex question",
        value: 3,
      },
      {
        name: "Complaint",
        value: 2,
      },
      {
        name: "Other",
        value: 1,
      },
    ],

    knowledgeGaps: [
      {
        question: "What is the delivery fee to Kumasi?",
        count: 8,
      },
      {
        question:
          "Do you accept returns after 7 days?",
        count: 5,
      },
      {
        question:
          "When will size XL be available?",
        count: 4,
      },
    ],

    funnel: {
      conversations: 84,
      productInterest: 39,
      orderAttempts: 23,
      completedOrders: 18,
    },

    customers: {
      new: 22,
      returning: 14,
      vip: 3,
    },
  },

  "7 days": {
    conversations: 612,
    conversationsChange: 12.4,
    aiResolved: 501,
    aiResolvedChange: 5.8,
    responseTime: 38,
    responseTimeChange: -18,
    revenue: 12480,
    revenueChange: 21.2,

    conversationChart: [
      61, 74, 83, 72, 96, 108, 118,
    ],

    intents: [
      { name: "Price", value: 31 },
      { name: "Size", value: 24 },
      { name: "Availability", value: 19 },
      { name: "Delivery", value: 13 },
      { name: "Order status", value: 8 },
      { name: "Other", value: 5 },
    ],

    topProducts: [
      {
        name: "Black Evening Dress",
        enquiries: 141,
        orders: 39,
        revenue: 17550,
      },
      {
        name: "Silk Dress",
        enquiries: 96,
        orders: 31,
        revenue: 27900,
      },
      {
        name: "Gold Heels",
        enquiries: 74,
        orders: 22,
        revenue: 12100,
      },
      {
        name: "Blue Kaftan",
        enquiries: 62,
        orders: 18,
        revenue: 9000,
      },
    ],

    channels: [
      {
        name: "WhatsApp",
        value: 52,
        conversations: 318,
        orders: 82,
        revenue: 6240,
      },
      {
        name: "Instagram",
        value: 28,
        conversations: 171,
        orders: 51,
        revenue: 3490,
      },
      {
        name: "Website",
        value: 15,
        conversations: 92,
        orders: 32,
        revenue: 1950,
      },
      {
        name: "Facebook",
        value: 5,
        conversations: 31,
        orders: 11,
        revenue: 800,
      },
    ],

    handoffs: 111,

    handoffReasons: [
      {
        name: "Customer requested agent",
        value: 39,
      },
      {
        name: "Order problem",
        value: 28,
      },
      {
        name: "Complex question",
        value: 21,
      },
      {
        name: "Complaint",
        value: 15,
      },
      {
        name: "Other",
        value: 8,
      },
    ],

    knowledgeGaps: [
      {
        question: "What is the delivery fee to Kumasi?",
        count: 31,
      },
      {
        question:
          "Do you accept returns after 7 days?",
        count: 21,
      },
      {
        question:
          "When will size XL be available?",
        count: 17,
      },
      {
        question:
          "Do you offer custom measurements?",
        count: 12,
      },
    ],

    funnel: {
      conversations: 612,
      productInterest: 281,
      orderAttempts: 174,
      completedOrders: 143,
    },

    customers: {
      new: 149,
      returning: 71,
      vip: 12,
    },
  },

  "30 days": {
    conversations: 2840,
    conversationsChange: 18.6,
    aiResolved: 2315,
    aiResolvedChange: 8.2,
    responseTime: 41,
    responseTimeChange: -22,
    revenue: 58340,
    revenueChange: 27.4,

    conversationChart: [
      71, 84, 96, 88, 103, 112, 121, 132, 127, 141,
      149, 154, 161, 173, 168, 181, 193, 187, 201,
      214, 208, 221, 230, 227, 238, 249, 256, 267, 281,
      294,
    ],

    intents: [
      { name: "Price", value: 33 },
      { name: "Size", value: 23 },
      { name: "Availability", value: 18 },
      { name: "Delivery", value: 13 },
      { name: "Order status", value: 8 },
      { name: "Other", value: 5 },
    ],

    topProducts: [
      {
        name: "Black Evening Dress",
        enquiries: 542,
        orders: 148,
        revenue: 66600,
      },
      {
        name: "Silk Dress",
        enquiries: 416,
        orders: 121,
        revenue: 108900,
      },
      {
        name: "Gold Heels",
        enquiries: 321,
        orders: 88,
        revenue: 48400,
      },
      {
        name: "Blue Kaftan",
        enquiries: 274,
        orders: 75,
        revenue: 37500,
      },
    ],

    channels: [
      {
        name: "WhatsApp",
        value: 52,
        conversations: 1477,
        orders: 381,
        revenue: 28340,
      },
      {
        name: "Instagram",
        value: 28,
        conversations: 795,
        orders: 223,
        revenue: 14690,
      },
      {
        name: "Website",
        value: 15,
        conversations: 426,
        orders: 124,
        revenue: 8970,
      },
      {
        name: "Facebook",
        value: 5,
        conversations: 142,
        orders: 47,
        revenue: 6340,
      },
    ],

    handoffs: 525,

    handoffReasons: [
      {
        name: "Customer requested agent",
        value: 182,
      },
      {
        name: "Order problem",
        value: 132,
      },
      {
        name: "Complex question",
        value: 104,
      },
      {
        name: "Complaint",
        value: 67,
      },
      {
        name: "Other",
        value: 40,
      },
    ],

    knowledgeGaps: [
      {
        question: "What is the delivery fee to Kumasi?",
        count: 94,
      },
      {
        question:
          "Do you accept returns after 7 days?",
        count: 76,
      },
      {
        question:
          "When will size XL be available?",
        count: 61,
      },
      {
        question:
          "Do you offer custom measurements?",
        count: 47,
      },
      {
        question: "Can I pay on delivery?",
        count: 31,
      },
    ],

    funnel: {
      conversations: 2840,
      productInterest: 1364,
      orderAttempts: 841,
      completedOrders: 702,
    },

    customers: {
      new: 638,
      returning: 319,
      vip: 47,
    },
  },

  "90 days": {
    conversations: 8014,
    conversationsChange: 24.1,
    aiResolved: 6552,
    aiResolvedChange: 10.7,
    responseTime: 46,
    responseTimeChange: -26,
    revenue: 169850,
    revenueChange: 33.9,

    conversationChart: [
      110, 128, 141, 157, 166, 178, 191, 205, 219, 231,
      243, 255, 269, 281, 293, 308, 321, 337, 349, 365,
      378, 394, 409, 425, 441, 458, 474, 491, 508, 528,
    ],

    intents: [
      { name: "Price", value: 32 },
      { name: "Size", value: 23 },
      { name: "Availability", value: 19 },
      { name: "Delivery", value: 13 },
      { name: "Order status", value: 8 },
      { name: "Other", value: 5 },
    ],

    topProducts: [
      {
        name: "Black Evening Dress",
        enquiries: 1488,
        orders: 422,
        revenue: 189900,
      },
      {
        name: "Silk Dress",
        enquiries: 1218,
        orders: 357,
        revenue: 321300,
      },
      {
        name: "Gold Heels",
        enquiries: 927,
        orders: 274,
        revenue: 150700,
      },
      {
        name: "Blue Kaftan",
        enquiries: 816,
        orders: 231,
        revenue: 115500,
      },
    ],

    channels: [
      {
        name: "WhatsApp",
        value: 53,
        conversations: 4247,
        orders: 1081,
        revenue: 80200,
      },
      {
        name: "Instagram",
        value: 27,
        conversations: 2164,
        orders: 593,
        revenue: 39900,
      },
      {
        name: "Website",
        value: 14,
        conversations: 1122,
        orders: 331,
        revenue: 25600,
      },
      {
        name: "Facebook",
        value: 6,
        conversations: 481,
        orders: 138,
        revenue: 14150,
      },
    ],

    handoffs: 1462,

    handoffReasons: [
      {
        name: "Customer requested agent",
        value: 508,
      },
      {
        name: "Order problem",
        value: 371,
      },
      {
        name: "Complex question",
        value: 284,
      },
      {
        name: "Complaint",
        value: 187,
      },
      {
        name: "Other",
        value: 112,
      },
    ],

    knowledgeGaps: [
      {
        question: "What is the delivery fee to Kumasi?",
        count: 312,
      },
      {
        question:
          "Do you accept returns after 7 days?",
        count: 249,
      },
      {
        question:
          "When will size XL be available?",
        count: 207,
      },
      {
        question:
          "Do you offer custom measurements?",
        count: 181,
      },
      {
        question: "Can I pay on delivery?",
        count: 149,
      },
    ],

    funnel: {
      conversations: 8014,
      productInterest: 3908,
      orderAttempts: 2384,
      completedOrders: 1961,
    },

    customers: {
      new: 1821,
      returning: 974,
      vip: 148,
    },
  },
};

/* =========================================================
   CHANNEL ICON
========================================================= */

const ChannelIcon = ({ name }) => {
  if (name === "WhatsApp") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50">
        <MessageCircle
          size={17}
          className="text-green-600"
        />
      </div>
    );
  }

  if (name === "Instagram") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50">
        <Share2
          size={17}
          className="text-pink-600"
        />
      </div>
    );
  }

  if (name === "Facebook") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
        <Share2
          size={17}
          className="text-blue-600"
        />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
      <Globe2
        size={17}
        className="text-gray-600"
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

  const data = analyticsData[range];

  const aiRate = useMemo(() => {
    if (!data.conversations) return 0;

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
    if (!data.funnel.conversations) return 0;

    return (
      (data.funnel.completedOrders /
        data.funnel.conversations) *
      100
    ).toFixed(1);
  }, [data]);

  const handoffRate = useMemo(() => {
    if (!data.conversations) return 0;

    return (
      (data.handoffs /
        data.conversations) *
      100
    ).toFixed(1);
  }, [data]);

  const visibleKnowledgeGaps = showAllGaps
    ? data.knowledgeGaps
    : data.knowledgeGaps.slice(0, 3);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gray-50">
      {/* ===================================================
          FIXED HEADER
      ==================================================== */}

      <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <BarChart3
                size={19}
                strokeWidth={1.8}
                className="shrink-0 text-gray-700"
              />

              <h1 className="truncate text-lg font-semibold text-gray-900">
                Analytics
              </h1>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Track customer engagement, AI performance and sales.
            </p>
          </div>

          <div className="relative shrink-0">
            <select
              value={range}
              onChange={(event) =>
                setRange(event.target.value)
              }
              className="
                h-10 appearance-none rounded-xl
                border border-gray-200
                bg-white
                pl-3 pr-9
                text-sm font-medium text-gray-700
                outline-none
                transition
                focus:border-gray-300
              "
            >
              <option value="Today">Today</option>
              <option value="7 days">7 days</option>
              <option value="30 days">30 days</option>
              <option value="90 days">90 days</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
            />

            <MetricCard
              icon={Bot}
              title="AI resolution rate"
              value={`${aiRate}%`}
              change={data.aiResolvedChange}
              positive={true}
              description={`${data.aiResolved.toLocaleString()} conversations handled by AI`}
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
            />

            <MetricCard
              icon={CircleDollarSign}
              title="Revenue influenced"
              value={`GHS ${data.revenue.toLocaleString()}`}
              change={data.revenueChange}
              positive={true}
              description="vs previous period"
            />
          </div>

          {/* =================================================
              CONVERSATIONS + INTENTS
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            {/* Conversation trend */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Conversations
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Customer conversations over time
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
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
            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Customer intent
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  What customers ask about most
                </p>
              </div>

              <div className="space-y-4 p-5">
                {data.intents.map((intent) => (
                  <div key={intent.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-medium text-gray-700">
                        {intent.name}
                      </span>

                      <span className="shrink-0 text-[10px] text-gray-400">
                        {intent.value}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gray-900 transition-all duration-500"
                        style={{
                          width: `${intent.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* =================================================
              SALES FUNNEL
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Conversation → Purchase
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  How customer conversations move toward completed orders
                </p>
              </div>

              <div className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                {conversionRate}% conversion
              </div>
            </div>

            <div className="grid md:grid-cols-4">
              <FunnelStep
                number="01"
                label="Conversations"
                value={data.funnel.conversations}
                icon={MessageSquare}
              />

              <FunnelStep
                number="02"
                label="Product interest"
                value={data.funnel.productInterest}
                icon={ShoppingBag}
              />

              <FunnelStep
                number="03"
                label="Order attempts"
                value={data.funnel.orderAttempts}
                icon={Package}
              />

              <FunnelStep
                number="04"
                label="Completed orders"
                value={data.funnel.completedOrders}
                icon={CheckCircle2}
                last
              />
            </div>
          </section>

          {/* =================================================
              PRODUCTS + CHANNELS
          ================================================== */}

          <div className="grid gap-5 xl:grid-cols-2">
            {/* Products */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Top products
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Products generating the most interest
                  </p>
                </div>

                <Package
                  size={17}
                  className="text-gray-400"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Product
                      </th>

                      <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Enquiries
                      </th>

                      <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Orders
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {data.topProducts.map(
                      (product, index) => (
                        <tr
                          key={product.name}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">
                                {index + 1}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-gray-900">
                                  {product.name}
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Product interest
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-4 text-right text-xs font-medium text-gray-700">
                            {product.enquiries.toLocaleString()}
                          </td>

                          <td className="px-3 py-4 text-right text-xs font-medium text-gray-700">
                            {product.orders.toLocaleString()}
                          </td>

                          <td className="px-5 py-4 text-right text-xs font-semibold text-gray-900">
                            GHS{" "}
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
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Channel performance
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Where customer conversations originate
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {data.channels.map((channel) => (
                  <div
                    key={channel.name}
                    className="px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <ChannelIcon
                        name={channel.name}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold text-gray-900">
                            {channel.name}
                          </p>

                          <p className="text-xs font-semibold text-gray-900">
                            {channel.value}%
                          </p>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gray-900"
                            style={{
                              width: `${channel.value}%`,
                            }}
                          />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400">
                          <span>
                            {channel.conversations.toLocaleString()}{" "}
                            conversations
                          </span>

                          <span>
                            {channel.orders.toLocaleString()}{" "}
                            orders
                          </span>

                          <span>
                            GHS{" "}
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
            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  AI performance
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  How the AI is handling customer conversations
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-5">
                <MiniMetric
                  icon={Bot}
                  label="AI handled"
                  value={data.aiResolved.toLocaleString()}
                />

                <MiniMetric
                  icon={UserRound}
                  label="Human handled"
                  value={(
                    data.conversations -
                    data.aiResolved
                  ).toLocaleString()}
                />

                <MiniMetric
                  icon={CheckCircle2}
                  label="Resolution rate"
                  value={`${aiRate}%`}
                />

                <MiniMetric
                  icon={Clock3}
                  label="Avg. response"
                  value={`${data.responseTime}s`}
                />
              </div>

              <div className="mx-5 mb-5 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      AI vs human
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Conversation handling
                    </p>
                  </div>

                  <Bot
                    size={17}
                    className="text-gray-400"
                  />
                </div>

                <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gray-900 transition-all duration-500"
                    style={{
                      width: `${aiRate}%`,
                    }}
                  />

                  <div
                    className="h-full bg-gray-300 transition-all duration-500"
                    style={{
                      width: `${humanRate}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                  <span>
                    AI {aiRate}%
                  </span>

                  <span>
                    Human {humanRate}%
                  </span>
                </div>
              </div>
            </section>

            {/* Customers */}
            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Customer activity
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Customer mix during this period
                </p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-3 gap-3">
                  <CustomerMetric
                    icon={Users}
                    label="New"
                    value={data.customers.new}
                  />

                  <CustomerMetric
                    icon={UserRound}
                    label="Returning"
                    value={data.customers.returning}
                  />

                  <CustomerMetric
                    icon={Sparkles}
                    label="VIP"
                    value={data.customers.vip}
                  />
                </div>

                <div className="mt-5 rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Returning customer ratio
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Returning customers compared with new customers
                      </p>
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="text-gray-400"
                    />
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    <p className="text-2xl font-semibold text-gray-900">
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

                    <span className="pb-1 text-[10px] text-gray-400">
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
            <section className="rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Human handoffs
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Conversations requiring a human
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                  <UserRound
                    size={16}
                    className="text-gray-600"
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data.handoffs.toLocaleString()}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      Total handoffs
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
                    {handoffRate}% of conversations
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {data.handoffReasons.map(
                    (reason) => {
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

                      return (
                        <div key={reason.name}>
                          <div className="mb-1.5 flex items-center justify-between gap-3">
                            <span className="truncate text-xs font-medium text-gray-700">
                              {reason.name}
                            </span>

                            <span className="text-[10px] text-gray-400">
                              {reason.value}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-gray-900"
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
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    AI knowledge gaps
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Questions the AI could not answer confidently
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                  <AlertTriangle
                    size={16}
                    className="text-amber-600"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {visibleKnowledgeGaps.map(
                  (gap) => (
                    <div
                      key={gap.question}
                      className="flex items-start gap-3 px-5 py-4"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <MessageSquare
                          size={13}
                          className="text-gray-500"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-5 text-gray-700">
                          {gap.question}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
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
                <div className="border-t border-gray-100 px-5 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllGaps(
                        (value) => !value
                      )
                    }
                    className="text-xs font-medium text-gray-600 transition hover:text-gray-900"
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
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Icon
            size={17}
            className="text-gray-600"
          />
        </div>

        <div
          className={`
            flex items-center gap-1
            rounded-full px-2 py-1
            text-[10px] font-medium
            ${
              positive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
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

      <p className="mt-4 text-xs font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-1 truncate text-2xl font-semibold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-gray-400">
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
              stroke="#eeeeee"
              strokeWidth="1"
            />
          );
        })}

        {/* Area */}
        <polygon
          points={areaPoints}
          fill="#f3f4f6"
        />

        {/* Line */}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#111827"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {values.map((value, index) => {
          const [x, y] = points[index]
            .split(",")
            .map(Number);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#111827"
            />
          );
        })}

        <text
          x={paddingLeft}
          y={height - 8}
          fontSize="10"
          fill="#9ca3af"
        >
          Start
        </text>

        <text
          x={width - paddingRight}
          y={height - 8}
          fontSize="10"
          fill="#9ca3af"
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
  last = false,
}) => {
  return (
    <div
      className={`
        flex items-center gap-4 p-5
        md:items-start
        ${
          !last
            ? "border-b border-gray-100 md:border-b-0 md:border-r"
            : ""
        }
      `}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
        <Icon
          size={17}
          className="text-gray-600"
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-gray-400">
            {number}
          </span>

          <p className="text-xs font-medium text-gray-500">
            {label}
          </p>
        </div>

        <p className="mt-1 text-xl font-semibold text-gray-900">
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
}) => {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2">
        <Icon
          size={15}
          className="text-gray-400"
        />

        <p className="text-[10px] font-medium text-gray-400">
          {label}
        </p>
      </div>

      <p className="mt-3 text-lg font-semibold text-gray-900">
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
}) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-center">
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white">
        <Icon
          size={15}
          className="text-gray-500"
        />
      </div>

      <p className="mt-3 text-lg font-semibold text-gray-900">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {label}
      </p>
    </div>
  );
};

export default Analytics;