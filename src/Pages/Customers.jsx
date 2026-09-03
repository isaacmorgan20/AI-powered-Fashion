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
import { useSettings } from "../hooks/useSettings";

/* =========================================================
   COLOR SYSTEM
========================================================= */

const statusStyles = {
  New: "bg-sky-50 text-sky-700 border border-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20",
  Active:
    "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  Repeat:
    "bg-pink-50 text-pink-700 border border-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/20",
  VIP: "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  "At Risk":
    "bg-red-50 text-red-700 border border-red-100 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
};

const channelStyles = {
  WhatsApp:
    "bg-green-50 text-green-700 border border-green-100 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20",
  Instagram:
    "bg-pink-50 text-pink-700 border border-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/20",
  Facebook:
    "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
  Website:
    "bg-cyan-50 text-cyan-700 border border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20",
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

  const { settings } = useSettings();

  const currency = settings?.general?.currency || "GHS";

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

  /* =========================================================
     AUTO SELECT
  ========================================================= */

  useEffect(() => {
    if (customers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  /* =========================================================
     CREATE CUSTOMER
  ========================================================= */

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

  /* =========================================================
     FILTER CUSTOMERS
  ========================================================= */

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

  /* =========================================================
     SELECT CUSTOMER
  ========================================================= */

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
    setMobileView("details");
  };

  /* =========================================================
     COUNTS
  ========================================================= */

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

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
            <Loader2
              size={26}
              className="animate-spin text-white"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     EMPTY CUSTOMER STATE
  ========================================================= */

  if (!selectedCustomer) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20">
        <div className="px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-xl shadow-violet-500/20">
            <UserRound size={30} className="text-white" />
          </div>

          <h2 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
            {customers.length === 0
              ? "No customers yet"
              : "No customer selected"}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            {customers.length === 0
              ? "Customers you create will appear here."
              : "Select a customer to view their details."}
          </p>

          {customers.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-700 hover:to-fuchsia-700"
            >
              <Plus size={16} />
              Add your first customer
            </button>
          )}
        </div>

        {showCreateModal && (
          <CreateCustomerModal
            newCustomerData={newCustomerData}
            setNewCustomerData={setNewCustomerData}
            handleCreateCustomer={handleCreateCustomer}
            setShowCreateModal={setShowCreateModal}
          />
        )}
      </div>
    );
  }

  /* =========================================================
     MAIN RETURN
  ========================================================= */

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20">

      {/* =====================================================
          CUSTOMER LIST
      ====================================================== */}

      <section
        className={`
          flex
          h-full
          min-h-0
          w-full
          shrink-0
          flex-col
          overflow-y-auto
          overflow-x-hidden
          bg-white/95
          backdrop-blur-xl
          dark:bg-slate-950/95

          lg:w-[350px]
          xl:w-[380px]
          2xl:w-[420px]

          lg:overflow-hidden
          lg:border-r
          lg:border-violet-100
          dark:lg:border-slate-800

          ${mobileView === "list" ? "flex" : "hidden lg:flex"}
        `}
      >

        {/* =====================================================
            CUSTOMER HEADER
        ====================================================== */}

        <div
          className="
            shrink-0
            border-b
            border-violet-100
            bg-gradient-to-br
            from-violet-50
            via-white
            to-pink-50
            px-4
            py-4
            sm:px-5
            dark:border-slate-800
            dark:from-violet-950/30
            dark:via-slate-950
            dark:to-pink-950/20

            lg:sticky
            lg:top-0
            lg:z-20
          "
        >

          {/* Title */}

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
                  <Users
                    size={19}
                    strokeWidth={2}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                    Customers
                  </h1>

                  <p className="mt-0.5 text-xs font-medium text-violet-600 dark:text-violet-300">
                    {totalCustomers}{" "}
                    {totalCustomers === 1 ? "customer" : "customers"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-violet-500/20 transition hover:from-violet-700 hover:to-fuchsia-700 sm:px-3.5"
              >
                <Plus size={15} />
                <span className="hidden sm:inline">
                  Add Customer
                </span>
              </button>

              <button
                type="button"
                className="rounded-xl border border-violet-100 bg-white/80 p-2 text-violet-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-violet-300 dark:hover:bg-violet-950/40"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Search */}

          <div className="relative mt-4">
            <Search
              size={16}
              strokeWidth={2}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-violet-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers"
              className="
                w-full
                rounded-xl
                border
                border-violet-100
                bg-white
                py-2.5
                pl-9
                pr-3
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-violet-400
                focus:ring-4
                focus:ring-violet-500/10
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-white
              "
            />
          </div>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="shrink-0 px-4 pt-4 sm:px-5">
          <div className="grid grid-cols-2 gap-2">
            <SummaryCard
              value={totalCustomers}
              label="Total"
              icon={Users}
              iconClass="bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
            />

            <SummaryCard
              value={activeCustomers}
              label="Active"
              icon={UserRound}
              iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
            />

            <SummaryCard
              value={repeatCustomers}
              label="Repeat"
              icon={Sparkles}
              iconClass="bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300"
            />

            <SummaryCard
              value={newCustomers}
              label="New"
              icon={Plus}
              iconClass="bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"
            />
          </div>
        </div>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <div className="shrink-0 px-4 pt-4 sm:px-5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {["All", "New", "Active", "Repeat", "VIP"].map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`
                    shrink-0
                    rounded-full
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    transition-all
                    ${
                      activeFilter === filter
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20"
                        : "border border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
                    }
                  `}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* =====================================================
            CUSTOMER LIST
        ====================================================== */}

        <div
          className="
            customer-list-scrollbar
            mt-3
            lg:min-h-0
            lg:flex-1
            lg:overflow-y-auto
            lg:overflow-x-hidden
            lg:overscroll-contain
          "
        >
          {loading ? (
            <div className="flex min-h-full items-center justify-center px-6 py-12">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-500/10">
                <Loader2
                  className="animate-spin text-violet-500"
                  size={22}
                />
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-full items-center justify-center px-6 py-12">
              <div className="max-w-xs text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
                  <AlertCircle
                    className="text-red-500"
                    size={24}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">
                  Failed to load customers
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {error}
                </p>

                <button
                  onClick={refetch}
                  className="mt-3 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex min-h-full items-center justify-center px-6 py-12">
              <div className="max-w-xs text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-500/10 dark:to-pink-500/10">
                  <Users
                    size={22}
                    className="text-violet-500"
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">
                  No customers found
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Try another name, email, phone number, or filter.
                </p>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20"
                >
                  <Plus size={16} />
                  Add Customer
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.map((customer) => {
                const active =
                  customer.id === selectedCustomerId;

                return (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() =>
                      handleSelectCustomer(customer.id)
                    }
                    className={`
                      group
                      block
                      w-full
                      border-l-4
                      px-4
                      py-4
                      text-left
                      transition-all
                      sm:px-5
                      ${
                        active
                          ? "border-l-violet-500 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/10"
                          : "border-l-transparent bg-white hover:border-l-violet-300 hover:bg-violet-50/50 dark:bg-slate-950 dark:hover:bg-slate-900"
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
                            rounded-2xl
                            text-xs
                            font-bold
                            shadow-sm
                            ${
                              active
                                ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-violet-500/20"
                                : "bg-gradient-to-br from-slate-100 to-violet-100 text-violet-700 dark:from-slate-800 dark:to-violet-950 dark:text-violet-300"
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
                              bg-emerald-500
                              shadow-sm
                              dark:border-slate-950
                            "
                          />
                        )}
                      </div>

                      {/* Customer information */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 truncate text-sm font-bold text-slate-900 dark:text-white">
                            {customer.name}
                          </p>

                          <span className="shrink-0 whitespace-nowrap text-[10px] font-medium text-slate-400">
                            {customer.lastInteraction}
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
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
                              font-bold
                              ${statusStyles[customer.status]}
                            `}
                          >
                            {customer.status}
                          </span>

                          <span className="truncate text-[10px] font-medium text-slate-400">
                            {customer.orders}{" "}
                            {customer.orders === 1
                              ? "order"
                              : "orders"}
                          </span>

                          <span className="shrink-0 text-slate-300">
                            •
                          </span>

                          <span className="truncate text-[10px] font-medium text-slate-400">
                            {typeof customer.totalSpent ===
                            "number"
                              ? `${currency} ${customer.totalSpent}`
                              : customer.totalSpent ||
                                `${currency} 0`}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}

                      <ChevronRight
                        size={16}
                        strokeWidth={2}
                        className={`
                          shrink-0
                          transition
                          ${
                            active
                              ? "text-violet-500"
                              : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-violet-500"
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
        className={
          "flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20 " +
          (mobileView === "details"
            ? "flex"
            : "hidden lg:flex")
        }
      >

        {/* ===================================================
            DETAILS HEADER
        ==================================================== */}

        <header className="flex shrink-0 items-center justify-between border-b border-violet-100 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile back */}

            <button
              type="button"
              onClick={() => setMobileView("list")}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-2
                text-slate-500
                transition
                hover:border-violet-200
                hover:bg-violet-50
                hover:text-violet-600
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-400
                dark:hover:bg-violet-950/30
                lg:hidden
              "
            >
              <ArrowLeft size={18} />
            </button>

            {/* Avatar */}

            <div className="relative shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-xs font-bold text-white shadow-lg shadow-violet-500/20">
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
                    bg-emerald-500
                    dark:border-slate-950
                  "
                />
              )}
            </div>

            {/* Name */}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                  {selectedCustomer.name}
                </h2>

                <span
                  className={`
                    hidden
                    rounded-full
                    px-2
                    py-1
                    text-[9px]
                    font-bold
                    sm:inline-flex
                    ${statusStyles[selectedCustomer.status]}
                  `}
                >
                  {selectedCustomer.status}
                </span>
              </div>

              <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                Customer since {selectedCustomer.joined}
              </p>
            </div>
          </div>

          {/* Header actions */}

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-xl p-2 text-violet-500 transition hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/30"
              title="Open conversation"
            >
              <MessageSquare size={17} />
            </button>

            <button
              type="button"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* ===================================================
            DETAILS SCROLL AREA
        ==================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-5 lg:p-6">

            {/* =================================================
                PROFILE + CONTACT
            ================================================== */}

            <div className="grid gap-4 xl:grid-cols-3">

              {/* Profile card */}

              <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="h-20 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500" />

                <div className="-mt-10 px-5 pb-5">
                  <div className="flex items-end gap-4">
                    <div className="relative shrink-0">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-xl font-bold text-white shadow-xl dark:border-slate-900">
                        {selectedCustomer.initials}
                      </div>

                      {selectedCustomer.online && (
                        <span
                          className="
                            absolute
                            bottom-1
                            right-1
                            h-4
                            w-4
                            rounded-full
                            border-2
                            border-white
                            bg-emerald-500
                            dark:border-slate-900
                          "
                        />
                      )}
                    </div>

                    <div className="min-w-0 pb-1">
                      <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {selectedCustomer.location}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      mt-4
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      ${statusStyles[selectedCustomer.status]}
                    `}
                  >
                    {selectedCustomer.status}
                  </span>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <ContactRow
                      icon={Phone}
                      value={selectedCustomer.phone}
                      iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                    />

                    <ContactRow
                      icon={Mail}
                      value={selectedCustomer.email}
                      iconClass="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                    />

                    <ContactRow
                      icon={MapPin}
                      value={selectedCustomer.location}
                      iconClass="bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300"
                    />

                    <ContactRow
                      icon={CalendarDays}
                      value={`Joined ${selectedCustomer.joined}`}
                      iconClass="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}

              <div className="grid grid-cols-2 gap-4 xl:col-span-2">
                <StatCard
                  icon={ShoppingBag}
                  label="Orders"
                  value={selectedCustomer.orders}
                  description="Total orders"
                  iconClass="bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                  valueClass="text-violet-700 dark:text-violet-300"
                />

                <StatCard
                  icon={CircleDollarSign}
                  label="Total spent"
                  value={
                    typeof selectedCustomer.totalSpent ===
                    "number"
                      ? `${currency} ${selectedCustomer.totalSpent}`
                      : selectedCustomer.totalSpent ||
                        `${currency} 0`
                  }
                  description="Customer value"
                  iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                  valueClass="text-emerald-700 dark:text-emerald-300"
                />

                <StatCard
                  icon={MessageSquare}
                  label="Conversations"
                  value={selectedCustomer.conversations}
                  description="Total interactions"
                  iconClass="bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300"
                  valueClass="text-pink-700 dark:text-pink-300"
                />

                <StatCard
                  icon={Clock3}
                  label="Last interaction"
                  value={
                    selectedCustomer.lastInteraction || "—"
                  }
                  description={`Via ${
                    selectedCustomer.channel ||
                    selectedCustomer.lastChannel ||
                    "—"
                  }`}
                  iconClass="bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300"
                  valueClass="text-sky-700 dark:text-sky-300"
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
                  accent="violet"
                />

                <div className="p-4">
                  {selectedCustomer.ordersList.length ===
                  0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="No orders yet"
                      description="Orders from this customer will appear here."
                      accent="violet"
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
                              rounded-2xl
                              border
                              border-violet-100
                              bg-gradient-to-r
                              from-violet-50/50
                              to-white
                              p-3
                              transition
                              hover:border-violet-200
                              hover:shadow-sm
                              dark:border-slate-800
                              dark:from-violet-950/10
                              dark:to-slate-900
                            "
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 dark:from-violet-500/10 dark:to-fuchsia-500/10 dark:text-violet-300">
                              <ShoppingBag size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                {order.product}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-slate-400">
                                {order.id} • {order.date}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
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
                                  font-bold
                                  ${
                                    order.status ===
                                    "Completed"
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                      : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
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
                  accent="pink"
                />

                <div className="p-4">
                  {selectedCustomer.products.length ===
                  0 ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="No products yet"
                      description="Products will appear here after customer activity."
                      accent="pink"
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
                              rounded-2xl
                              border
                              border-pink-100
                              bg-gradient-to-r
                              from-pink-50
                              to-white
                              p-3
                              transition
                              hover:border-pink-200
                              hover:shadow-sm
                              dark:border-slate-800
                              dark:from-pink-950/10
                              dark:to-slate-900
                            "
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-fuchsia-100 text-pink-600 dark:from-pink-500/10 dark:to-fuchsia-500/10 dark:text-pink-300">
                              <ShoppingBag size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
                                {product.name}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {product.price}
                              </p>
                            </div>

                            <ChevronRight
                              size={14}
                              className="text-pink-300"
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
                accent="blue"
              />

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
                        hover:bg-blue-50/50
                        dark:hover:bg-blue-950/10
                      "
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 dark:from-blue-500/10 dark:to-cyan-500/10 dark:text-blue-300">
                        <MessageSquare size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`
                              rounded-full
                              px-2
                              py-1
                              text-[9px]
                              font-bold
                              ${
                                channelStyles[
                                  conversation.channel
                                ] ||
                                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              }
                            `}
                          >
                            {conversation.channel}
                          </span>

                          <span className="text-[10px] font-medium text-slate-400">
                            {conversation.date}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {conversation.preview}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {conversation.status}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className="shrink-0 text-blue-300 transition group-hover:text-blue-500"
                      />
                    </button>
                  )
                )}
              </div>
            </Card>

            {/* =================================================
                CUSTOMER INSIGHT
            ================================================== */}

            <div className="overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 shadow-sm dark:border-violet-500/20 dark:from-violet-950/30 dark:via-fuchsia-950/20 dark:to-pink-950/20">
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20">
                  <Sparkles
                    size={18}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-violet-950 dark:text-white">
                      Customer insight
                    </h3>

                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                      AI
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-violet-600/70 dark:text-violet-300/70">
                    Useful information from customer activity
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {selectedCustomer.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                INTERNAL NOTES
            ================================================== */}

            <Card>
              <CardHeader
                title="Internal notes"
                subtitle="Visible only to the seller and authorized team members"
                action="Edit"
                accent="amber"
              />

              <div className="p-5">
                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-amber-500/20 dark:from-amber-950/20 dark:to-orange-950/10">
                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {selectedCustomer.notes}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* =====================================================
          ADD CUSTOMER MODAL
      ====================================================== */}

      {showCreateModal && (
        <CreateCustomerModal
          newCustomerData={newCustomerData}
          setNewCustomerData={setNewCustomerData}
          handleCreateCustomer={handleCreateCustomer}
          setShowCreateModal={setShowCreateModal}
        />
      )}
    </div>
  );
};

/* =========================================================
   ADD CUSTOMER MODAL
========================================================= */

const CreateCustomerModal = ({
  newCustomerData,
  setNewCustomerData,
  handleCreateCustomer,
  setShowCreateModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

        {/* Modal header */}

        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 px-6 py-5">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 left-20 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Users size={18} className="text-white" />
                </div>

                <h2 className="text-lg font-bold text-white">
                  Add Customer
                </h2>
              </div>

              <p className="mt-1 text-xs text-violet-100">
                Add a new customer to your workspace
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}

        <form onSubmit={handleCreateCustomer}>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">

            {/* Name */}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-violet-100
                  bg-violet-50/40
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-violet-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-violet-500/10
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
                required
                autoFocus
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-emerald-100
                  bg-emerald-50/30
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-emerald-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-emerald-500/10
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-blue-100
                  bg-blue-50/30
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>

            {/* Location */}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-pink-100
                  bg-pink-50/30
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-pink-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-pink-500/10
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>

            {/* Channel */}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-cyan-100
                  bg-cyan-50/30
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-cyan-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-cyan-500/10
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              >
                <option value="Website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>

            {/* Notes */}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
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
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-amber-100
                  bg-amber-50/30
                  px-3
                  py-2.5
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-amber-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-amber-500/10
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/50">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:border-slate-300
                hover:bg-slate-50
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!newCustomerData.name.trim()}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                shadow-md
                shadow-violet-500/20
                transition
                hover:from-violet-700
                hover:to-fuchsia-700
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Plus size={16} />
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  value,
  label,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={15} />
        </div>

        <p className="text-lg font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>

      <p className="mt-2 text-[10px] font-semibold text-slate-400">
        {label}
      </p>
    </div>
  );
};

/* =========================================================
   CONTACT ROW
========================================================= */

const ContactRow = ({
  icon: Icon,
  value,
  iconClass = "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
}) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={14} />
      </div>

      <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  iconClass,
  valueClass,
}) => {
  return (
    <div className="group rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={17} />
        </div>
      </div>

      <p
        className={`mt-4 truncate text-xl font-bold sm:text-2xl ${
          valueClass || "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[10px] font-medium text-slate-400">
        {description}
      </p>
    </div>
  );
};

/* =========================================================
   CARD
========================================================= */

const Card = ({ children }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {children}
    </div>
  );
};

/* =========================================================
   CARD HEADER
========================================================= */

const CardHeader = ({
  title,
  subtitle,
  action,
  accent = "violet",
}) => {
  const accentStyles = {
    violet:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    pink:
      "bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300",
    blue:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    amber:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentStyles[accent]}`}
        >
          {accent === "violet" && <Sparkles size={16} />}
          {accent === "pink" && <ShoppingBag size={16} />}
          {accent === "blue" && <MessageSquare size={16} />}
          {accent === "amber" && <CircleDollarSign size={16} />}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 truncate text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && (
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-violet-600 transition hover:bg-violet-50 hover:text-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/30"
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

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({
  icon: Icon,
  title,
  description,
  accent = "violet",
}) => {
  const styles = {
    violet:
      "from-violet-50 to-fuchsia-50 text-violet-500 dark:from-violet-950/20 dark:to-fuchsia-950/10 dark:text-violet-300",
    pink:
      "from-pink-50 to-fuchsia-50 text-pink-500 dark:from-pink-950/20 dark:to-fuchsia-950/10 dark:text-pink-300",
    blue:
      "from-blue-50 to-cyan-50 text-blue-500 dark:from-blue-950/20 dark:to-cyan-950/10 dark:text-blue-300",
  };

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br px-5 py-8 text-center ${styles[accent]}`}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 shadow-sm dark:bg-slate-900/50">
        <Icon size={22} />
      </div>

      <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-200">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-xs text-[10px] leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
};

export default Customers;