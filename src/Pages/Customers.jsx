import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Users,
  UserRound,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  MessageSquare,
  Clock3,
  ChevronRight,
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  MoreHorizontal,
  ExternalLink,
  Sparkles,
  Loader2,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";

import { useCustomers } from "../hooks/useCustomers";

/* =========================================================
   STYLES
========================================================= */

const statusStyles = {
  New: "bg-blue-50 text-blue-700",
  Active: "bg-green-50 text-green-700",
  Repeat: "bg-purple-50 text-purple-700",
  VIP: "bg-amber-50 text-amber-700",
  "At Risk": "bg-red-50 text-red-700",
};

const channelStyles = {
  WhatsApp: "bg-green-50 text-green-700",
  Instagram: "bg-pink-50 text-pink-700",
  Facebook: "bg-blue-50 text-blue-700",
  Website: "bg-gray-100 text-gray-700",
};

/* =========================================================
   CUSTOMERS PAGE
========================================================= */

const Customers = () => {
  const {
    customers,
    loading,
    error,
    refetch,
    createCustomer,
    updateCustomer,
  } = useCustomers();

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");

  const [mobileView, setMobileView] = useState("list");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    channel: "Website",
    notes: "",
  });

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId
  );

  // Auto-select first customer when loaded
  useEffect(() => {
    if (customers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  const handleCreateCustomer = async (event) => {
    event.preventDefault();
    if (!newCustomerData.name.trim()) return;

    try {
      const initials = newCustomerData.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const created = await createCustomer({
        ...newCustomerData,
        initials,
      });

      setSelectedCustomerId(created.id);
      setShowCreateModal(false);
      setNewCustomerData({
        name: "",
        phone: "",
        email: "",
        location: "",
        channel: "Website",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to create customer:", err);
    }
  };

  /* =======================================================
     FILTER CUSTOMERS
  ======================================================= */

  const filteredCustomers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        !searchValue ||
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue) ||
        customer.phone.toLowerCase().includes(searchValue) ||
        customer.location.toLowerCase().includes(searchValue);

      const matchesFilter =
        activeFilter === "All" || customer.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [customers, search, activeFilter]);

  /* =======================================================
     SELECT CUSTOMER
  ======================================================= */

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
    setMobileView("details");
  };

  /* =======================================================
     COUNTS
  ======================================================= */

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const repeatCustomers = customers.filter(
    (customer) => customer.status === "Repeat" || customer.status === "VIP"
  ).length;

  const newCustomers = customers.filter(
    (customer) => customer.status === "New"
  ).length;

  /* =======================================================
     EMPTY STATE - NO CUSTOMER SELECTED
  ======================================================= */

  if (!selectedCustomer && !loading) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-gray-50">
        <div className="text-center">
          <UserRound size={36} className="mx-auto mb-3 text-gray-300" />

          <h2 className="text-sm font-semibold text-gray-700">
            No customer selected
          </h2>

          {customers.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus size={16} /> Add your first customer
            </button>
          )}
        </div>
      </div>
    );
  }

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-gray-50">

      {/* =====================================================
          CUSTOMER LIST
          
          MOBILE / TABLET:
          - Entire panel scrolls
          - Header scrolls away naturally

          DESKTOP:
          - Panel itself does not scroll
          - Only customer list scrolls
      ====================================================== */}

      <section
        className={`
          flex
          h-full
          min-h-0
          w-full
          shrink-0
          flex-col
          bg-white

          overflow-y-auto
          overflow-x-hidden

          lg:w-[350px]
          xl:w-[380px]
          2xl:w-[420px]

          lg:overflow-hidden
          lg:border-r
          lg:border-gray-200

          ${mobileView === "list"
            ? "flex"
            : "hidden lg:flex"
          }
        `}
      >

        {/* =====================================================
            CUSTOMER HEADER

            MOBILE / TABLET:
            - Normal document flow
            - Scrolls with customer list

            DESKTOP:
            - Sticky
            - Remains visible while customer list scrolls
        ====================================================== */}

        <div
          className="
            shrink-0
            border-b border-gray-200
            bg-white
            px-4
            py-4
            sm:px-5

            lg:sticky
            lg:top-0
            lg:z-20
          "
        >

          {/* Title */}
<div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Users
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 text-gray-700"
                  />

                  <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                    Customers
                  </h1>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {totalCustomers}{" "}
                  {totalCustomers === 1 ? "customer" : "customers"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="
                    shrink-0
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-white
                    bg-gray-900
                    transition
                    hover:bg-gray-800
                  "
                >
                  <Plus size={16} />
                  Add Customer
                </button>

                <button
                  type="button"
                  className="
                    shrink-0
                    rounded-lg
                    p-2
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search
              size={16}
              strokeWidth={1.8}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search customers"
              className="
                h-10
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                pl-9
                pr-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-gray-300
                focus:bg-white
                focus:ring-1
                focus:ring-gray-200
              "
            />
          </div>

          {/* Summary */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <SummaryCard
              value={totalCustomers}
              label="Total"
            />

            <SummaryCard
              value={activeCustomers}
              label="Active"
            />

            <SummaryCard
              value={repeatCustomers}
              label="Repeat"
            />

            <SummaryCard
              value={newCustomers}
              label="New"
            />
          </div>

          {/* Filters */}
          <div
            className="
              mt-4
              flex
              gap-2
              overflow-x-auto
              pb-1
              scrollbar-none
            "
          >
            {[
              "All",
              "New",
              "Active",
              "Repeat",
              "VIP",
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`
                  shrink-0
                  rounded-full
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  transition
                  ${
                    activeFilter === filter
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================
            CUSTOMER LIST

            MOBILE:
            - No independent overflow
            - Parent section scrolls

            DESKTOP:
            - Takes remaining height
            - Scrolls independently
        ====================================================== */}

        <div
          className="
            customer-list-scrollbar
            lg:min-h-0
            lg:flex-1
            lg:overflow-y-auto
            lg:overflow-x-hidden
            lg:overscroll-contain
          "
        >
          {loading ? (
            <div className="flex min-h-full items-center justify-center px-6 py-12">
              <Loader2 className="mx-auto text-gray-300 animate-spin" size={28} />
            </div>
          ) : error ? (
            <div className="flex min-h-full items-center justify-center px-6 py-12">
              <div className="max-w-xs text-center">
                <AlertCircle className="mx-auto mb-3 text-red-400" size={28} />
                <p className="text-sm font-medium text-gray-700">
                  Failed to load customers
                </p>
                <p className="mt-1 text-xs text-gray-400">{error}</p>
                <button
                  onClick={refetch}
                  className="mt-3 text-xs font-medium text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex min-h-full items-center justify-center px-6 py-12">
              <div className="max-w-xs text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Users size={22} className="text-gray-400" />
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-700">
                  No customers found
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Try another name, email, phone number, or filter.
                </p>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <Plus size={16} /> Add your first customer
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => {
                const active =
                  customer.id === selectedCustomerId;

                return (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() =>
                      handleSelectCustomer(
                        customer.id
                      )
                    }
                    className={`
                      group
                      block
                      w-full
                      px-4
                      py-4
                      text-left
                      transition
                      sm:px-5
                      ${
                        active
                          ? "bg-gray-50"
                          : "bg-white hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex min-w-0 items-center gap-3">

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            text-xs
                            font-semibold
                            ${
                              active
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700"
                            }
                          `}
                        >
                          {customer.initials}
                        </div>

                        {customer.online && (
                          <span
                            className="
                              absolute
                              bottom-0
                              right-0
                              h-3
                              w-3
                              rounded-full
                              border-2
                              border-white
                              bg-green-500
                            "
                          />
                        )}
                      </div>

                      {/* Customer information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 truncate text-sm font-semibold text-gray-900">
                            {customer.name}
                          </p>

                          <span className="shrink-0 whitespace-nowrap text-[10px] text-gray-400">
                            {customer.lastInteraction}
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {customer.email}
                        </p>

                        <div className="mt-2 flex min-w-0 items-center gap-2">
                          <span
                            className={`
                              shrink-0
                              rounded-full
                              px-2
                              py-1
                              text-[9px]
                              font-medium
                              ${
                                statusStyles[
                                  customer.status
                                ]
                              }
                            `}
                          >
                            {customer.status}
                          </span>

                          <span className="truncate text-[10px] text-gray-400">
                            {customer.orders}{" "}
                            {customer.orders === 1
                              ? "order"
                              : "orders"}
                          </span>

                          <span className="shrink-0 text-gray-300">
                            •
                          </span>

                          <span className="truncate text-[10px] text-gray-400">
                            {customer.totalSpent}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={16}
                        strokeWidth={1.8}
                        className={`
                          shrink-0
                          transition
                          ${
                            active
                              ? "text-gray-500"
                              : "text-gray-300 group-hover:text-gray-500"
                          }
                        `}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          CUSTOMER DETAILS
      ====================================================== */}

      <section
        className={`
          flex
          h-full
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-gray-50

          ${
            mobileView === "details"
              ? "flex"
              : "hidden lg:flex"
          }
        `}
      >

        {/* ===================================================
            CUSTOMER DETAILS HEADER

            This remains fixed because the details content
            below it is the scrolling container.
        ==================================================== */}

        <header
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            px-4
            py-3
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile back */}
            <button
              type="button"
              onClick={() =>
                setMobileView("list")
              }
              className="
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
                lg:hidden
              "
            >
              <ArrowLeft size={18} />
            </button>

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                {selectedCustomer.initials}
              </div>

              {selectedCustomer.online && (
                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-3
                    w-3
                    rounded-full
                    border-2
                    border-white
                    bg-green-500
                  "
                />
              )}
            </div>

            {/* Name */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                  {selectedCustomer.name}
                </h2>

                <span
                  className={`
                    hidden
                    rounded-full
                    px-2
                    py-1
                    text-[9px]
                    font-medium
                    sm:inline-flex
                    ${
                      statusStyles[
                        selectedCustomer.status
                      ]
                    }
                  `}
                >
                  {selectedCustomer.status}
                </span>
              </div>

              <p className="mt-0.5 truncate text-[11px] text-gray-400">
                Customer since{" "}
                {selectedCustomer.joined}
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
              "
              title="Open conversation"
            >
              <MessageSquare size={17} />
            </button>

            <button
              type="button"
              className="
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
              "
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* ===================================================
            ONLY DETAILS AREA SCROLLS
        ==================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
          "
        >
          <div className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-5 lg:p-6">

            {/* =================================================
                PROFILE + CONTACT
            ================================================== */}

            <div className="grid gap-4 xl:grid-cols-3">

              {/* Profile card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                      {selectedCustomer.initials}
                    </div>

                    {selectedCustomer.online && (
                      <span
                        className="
                          absolute
                          bottom-0
                          right-0
                          h-3.5
                          w-3.5
                          rounded-full
                          border-2
                          border-white
                          bg-green-500
                        "
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {selectedCustomer.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {selectedCustomer.location}
                    </p>

                    <span
                      className={`
                        mt-2
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        ${
                          statusStyles[
                            selectedCustomer.status
                          ]
                        }
                      `}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                  <ContactRow
                    icon={Phone}
                    value={selectedCustomer.phone}
                  />

                  <ContactRow
                    icon={Mail}
                    value={selectedCustomer.email}
                  />

                  <ContactRow
                    icon={MapPin}
                    value={selectedCustomer.location}
                  />

                  <ContactRow
                    icon={CalendarDays}
                    value={`Joined ${selectedCustomer.joined}`}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 xl:col-span-2">
                <StatCard
                  icon={ShoppingBag}
                  label="Orders"
                  value={selectedCustomer.orders}
                  description="Total orders"
                />

                <StatCard
                  icon={CircleDollarSign}
                  label="Total spent"
                  value={selectedCustomer.totalSpent}
                  description="Customer value"
                />

                <StatCard
                  icon={MessageSquare}
                  label="Conversations"
                  value={selectedCustomer.conversations}
                  description="Total interactions"
                />

                <StatCard
                  icon={Clock3}
                  label="Last interaction"
                  value={selectedCustomer.lastInteraction}
                  description={`Via ${selectedCustomer.lastChannel}`}
                />
              </div>
            </div>

            {/* =================================================
                ORDERS + PRODUCTS
            ================================================== */}

            <div className="grid gap-4 xl:grid-cols-2">

              {/* Orders */}
              <Card>
                <CardHeader
                  title="Recent orders"
                  subtitle={`${selectedCustomer.orders} total ${
                    selectedCustomer.orders === 1
                      ? "order"
                      : "orders"
                  }`}
                  action="View all"
                />

                <div className="p-4">
                  {selectedCustomer.ordersList.length ===
                  0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="No orders yet"
                      description="Orders from this customer will appear here."
                    />
                  ) : (
                    <div className="space-y-2">
                      {selectedCustomer.ordersList.map(
                        (order) => (
                          <div
                            key={order.id}
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              border
                              border-gray-100
                              p-3
                              transition
                              hover:border-gray-200
                              hover:bg-gray-50
                            "
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                              <ShoppingBag
                                size={16}
                                className="text-gray-500"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-gray-900">
                                {order.product}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-gray-400">
                                {order.id} •{" "}
                                {order.date}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs font-semibold text-gray-900">
                                {order.amount}
                              </p>

                              <span
                                className={`
                                  mt-1
                                  inline-flex
                                  rounded-full
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-medium
                                  ${
                                    order.status ===
                                    "Completed"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-amber-50 text-amber-700"
                                  }
                                `}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader
                  title="Products"
                  subtitle="Purchased or discussed"
                />

                <div className="p-4">
                  {selectedCustomer.products.length ===
                  0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="No products yet"
                      description="Products will appear here after customer activity."
                    />
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {selectedCustomer.products.map(
                        (product) => (
                          <div
                            key={product.name}
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              bg-gray-50
                              p-3
                            "
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200">
                              <ShoppingBag
                                size={16}
                                className="text-gray-500"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-gray-800">
                                {product.name}
                              </p>

                              <p className="mt-1 text-[10px] text-gray-400">
                                {product.price}
                              </p>
                            </div>

                            <ChevronRight
                              size={14}
                              className="text-gray-300"
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* =================================================
                CONVERSATION HISTORY
            ================================================== */}

            <Card>
              <CardHeader
                title="Conversation history"
                subtitle="Previous interactions with this customer"
                action="Open Inbox"
              />

              <div className="divide-y divide-gray-100">
                {selectedCustomer.conversationsList.map(
                  (conversation, index) => (
                    <button
                      key={`${conversation.date}-${index}`}
                      type="button"
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-5
                        py-4
                        text-left
                        transition
                        hover:bg-gray-50
                      "
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        <MessageSquare
                          size={16}
                          className="text-gray-500"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`
                              rounded-full
                              px-2
                              py-1
                              text-[9px]
                              font-medium
                              ${
                                channelStyles[
                                  conversation.channel
                                ]
                              }
                            `}
                          >
                            {conversation.channel}
                          </span>

                          <span className="text-[10px] text-gray-400">
                            {conversation.date}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-medium text-gray-700">
                          {conversation.preview}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {conversation.status}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className="shrink-0 text-gray-300"
                      />
                    </button>
                  )
                )}
              </div>
            </Card>

            {/* =================================================
                CUSTOMER INSIGHT
            ================================================== */}

            <Card>
              <div className="flex items-start gap-3 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <Sparkles
                    size={16}
                    className="text-gray-600"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Customer insight
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Useful information from customer activity
                  </p>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {selectedCustomer.notes}
                  </p>
                </div>
              </div>
            </Card>

            {/* =================================================
                INTERNAL NOTES
            ================================================== */}

            <Card>
              <CardHeader
                title="Internal notes"
                subtitle="Visible only to the seller and authorized team members"
                action="Edit"
              />

              <div className="p-5">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    {selectedCustomer.notes}
                  </p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );

  /* =======================================================
     CREATE CUSTOMER MODAL
  ======================================================= */

  if (showCreateModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Add Customer</h2>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreateCustomer}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCustomerData.name}
                  onChange={(e) =>
                    setNewCustomerData({
                      ...newCustomerData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Customer name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCustomerData.phone}
                  onChange={(e) =>
                    setNewCustomerData({
                      ...newCustomerData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+233 24 123 4567"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomerData.email}
                  onChange={(e) =>
                    setNewCustomerData({
                      ...newCustomerData,
                      email: e.target.value,
                    })
                  }
                  placeholder="customer@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newCustomerData.location}
                  onChange={(e) =>
                    setNewCustomerData({
                      ...newCustomerData,
                      location: e.target.value,
                    })
                  }
                  placeholder="Accra, Ghana"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Channel
                </label>
                <select
                  value={newCustomerData.channel}
                  onChange={(e) =>
                    setNewCustomerData({
                      ...newCustomerData,
                      channel: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200"
                >
                  <option value="Website">Website</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCustomerData.notes}
                  onChange={(e) =>
                    setNewCustomerData({
                      ...newCustomerData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Internal notes about this customer"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200 resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newCustomerData.name.trim()}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const SummaryCard = ({
  value,
  label,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 px-2 py-2.5">
      <p className="text-sm font-semibold text-gray-900">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] text-gray-400">
        {label}
      </p>
    </div>
  );
};

const ContactRow = ({
  icon: Icon,
  value,
}) => {
  return (
    <div className="flex items-center gap-3">
      <Icon
        size={15}
        className="shrink-0 text-gray-400"
      />

      <span className="truncate text-xs text-gray-600">
        {value}
      </span>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <Icon
          size={17}
          className="text-gray-400"
        />
      </div>

      <p className="mt-3 truncate text-xl font-semibold text-gray-900 sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {description}
      </p>
    </div>
  );
};

const Card = ({ children }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {children}
    </div>
  );
};

const CardHeader = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 truncate text-xs text-gray-400">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <button
          type="button"
          className="
            flex
            shrink-0
            items-center
            gap-1
            text-xs
            font-medium
            text-gray-600
            transition
            hover:text-gray-900
          "
        >
          {action === "Open Inbox" && (
            <ExternalLink size={12} />
          )}

          {action}
        </button>
      )}
    </div>
  );
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-xl bg-gray-50 px-5 py-8 text-center">
      <Icon
        size={24}
        className="mx-auto mb-2 text-gray-300"
      />

      <p className="text-xs font-semibold text-gray-700">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-xs text-[10px] leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default Customers;