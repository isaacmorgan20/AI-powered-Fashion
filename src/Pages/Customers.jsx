import { useMemo, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  UserRound,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  CalendarDays,
  MoreHorizontal,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Plus,
  X,
  MessageCircle,
} from "lucide-react";

import { useCustomers } from "../hooks/useCustomers";
import { useSettings } from "../hooks/useSettings";

import {
  Button,
  Input,
  Select,
  Textarea,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  EmptyState,
  Spinner,
  Divider,
} from "../Components/ui";

/* =========================================================
   HELPERS
========================================================= */

const statusVariants = {
  New: "info",
  Active: "success",
  Repeat: "default",
  VIP: "warning",
  "At Risk": "error",
};

const channelVariants = {
  WhatsApp: "success",
  Instagram: "default",
  Facebook: "info",
  Website: "default",
  Telegram: "info",
};

const getTelegramDisplayName = (customer) => {
  if (
    customer.channel !== "Telegram" &&
    customer.channel !== "telegram"
  ) {
    return customer.name || "Unknown customer";
  }

  if (customer.telegram_username) {
    const username = customer.telegram_username;

    return username.startsWith("@")
      ? username
      : `@${username}`;
  }

  const firstName = customer.telegram_first_name || "";
  const lastName = customer.telegram_last_name || "";

  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }

  return customer.name || "Unknown customer";
};

const getCustomerValue = (value, fallback = "—") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
};

const getTotalSpent = (customer, currency) => {
  if (typeof customer.totalSpent === "number") {
    return `${currency} ${customer.totalSpent}`;
  }

  return customer.totalSpent || `${currency} 0`;
};

/* =========================================================
   CUSTOMERS PAGE
========================================================= */

const Customers = () => {
  const {
    customers = [],
    loading,
    error,
    refetch,
    createCustomer,
    isOnline,
  } = useCustomers();

  const { settings } = useSettings();

  const currency =
    settings?.general?.currency || "GHS";

  const [selectedCustomerId, setSelectedCustomerId] =
    useState(null);

  const { id: routeCustomerId } = useParams();
  const appliedRouteCustomerRef = useRef(null);

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [mobileShowDetails, setMobileShowDetails] =
    useState(false);

  const [newCustomerData, setNewCustomerData] =
    useState({
      name: "",
      phone: "",
      email: "",
      location: "",
      channel: "Website",
      notes: "",
    });

  const selectedCustomer = customers.find(
    (customer) =>
      customer.id === selectedCustomerId
  );

  /* =======================================================
     AUTO SELECT CUSTOMER
  ======================================================= */

  useEffect(() => {
    if (
      customers.length > 0 &&
      !selectedCustomerId
    ) {
      const timer = setTimeout(() => {
        setSelectedCustomerId(customers[0].id);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [customers, selectedCustomerId]);

  /* =======================================================
     DEEP LINK (?/customers/:id from notification clicks)
  ======================================================= */

  useEffect(() => {
    if (
      !routeCustomerId ||
      appliedRouteCustomerRef.current === routeCustomerId
    ) {
      return;
    }

    if (
      customers.some(
        (customer) => customer.id === routeCustomerId
      )
    ) {
      appliedRouteCustomerRef.current = routeCustomerId;
      const timer = setTimeout(() => {
        setSelectedCustomerId(routeCustomerId);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [routeCustomerId, customers]);

  /* =======================================================
     CREATE CUSTOMER
  ======================================================= */

  const handleCreateCustomer = async (event) => {
    event.preventDefault();

    const customerName =
      newCustomerData.name.trim();

    if (!customerName) return;

    try {
      const initials = customerName
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const created = await createCustomer({
        ...newCustomerData,
        name: customerName,
        initials,
      });

      if (created?.id) {
        setSelectedCustomerId(created.id);
        setMobileShowDetails(true);
      }

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
      console.error(
        "Failed to create customer:",
        err
      );
    }
  };

  /* =======================================================
     FILTER CUSTOMERS
  ======================================================= */

  const filteredCustomers = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return customers.filter((customer) => {
      const name =
        customer.name?.toLowerCase() || "";

      const displayName =
        getTelegramDisplayName(customer)
          ?.toLowerCase() || "";

      const email =
        customer.email?.toLowerCase() || "";

      const phone =
        customer.phone?.toLowerCase() || "";

      const location =
        customer.location?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        displayName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue) ||
        location.includes(searchValue);

      const matchesFilter =
        activeFilter === "All" ||
        customer.status === activeFilter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    customers,
    search,
    activeFilter,
  ]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Active"
    ).length;

  const repeatCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Repeat" ||
        customer.status === "VIP"
    ).length;

  const newCustomers =
    customers.filter(
      (customer) =>
        customer.status === "New"
    ).length;

  /* =======================================================
     SELECT CUSTOMER
  ======================================================= */

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
    setMobileShowDetails(true);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && customers.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg-primary">
        <div className="space-y-4 text-center">
          <Spinner size="lg" />

          <p className="text-sm font-medium text-text-muted">
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    customers.length === 0 &&
    !loading
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg-primary p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Users
              size={30}
              className="text-primary"
            />
          </div>

          <CardTitle>
            No customers yet
          </CardTitle>

          <CardDescription className="mx-auto mt-2 max-w-sm">
            Customers you create or receive
            through your connected channels
            will appear here.
          </CardDescription>

          <Button
            onClick={() =>
              setShowCreateModal(true)
            }
            className="mt-6 w-full"
          >
            <Plus size={16} />
            <span>
              Add your first customer
            </span>
          </Button>

          {showCreateModal && (
            <CreateCustomerModal
              newCustomerData={
                newCustomerData
              }
              setNewCustomerData={
                setNewCustomerData
              }
              handleCreateCustomer={
                handleCreateCustomer
              }
              setShowCreateModal={
                setShowCreateModal
              }
            />
          )}
        </Card>
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="flex h-full w-full overflow-hidden bg-bg-primary">
      {/* ===================================================
          CUSTOMER LIST
      =================================================== */}

      <aside
        className={`
          flex h-full w-full shrink-0 flex-col
          border-r border-border-light
          bg-surface-primary
          lg:w-[380px]
          xl:w-[400px]
          ${mobileShowDetails
            ? "hidden lg:flex"
            : "flex"
          }
        `}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-border-light bg-surface-primary px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Users
                  size={19}
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-text-primary">
                  Customers
                </h1>

                <p className="text-xs text-text-muted">
                  {totalCustomers}{" "}
                  {totalCustomers === 1
                    ? "customer"
                    : "customers"}
                </p>
              </div>
            </div>

            <Button
              onClick={() =>
                setShowCreateModal(true)
              }
              size="md"
              className="shrink-0"
            >
              <Plus size={16} className="text-white" />

              <span className="hidden sm:inline text-white">
                Add Customer
              </span>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="shrink-0 border-b border-border-light bg-surface-primary px-4 py-4 sm:px-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Users}
              label="Total"
              value={totalCustomers}
            />

            <StatCard
              icon={UserRound}
              label="Active"
              value={activeCustomers}
              variant="success"
            />

            <StatCard
              icon={Sparkles}
              label="Repeat"
              value={repeatCustomers}
              variant="warning"
            />

            <StatCard
              icon={Plus}
              label="New"
              value={newCustomers}
              variant="info"
            />
          </div>
        </div>

        {/* Search + Filters */}
        <div className="shrink-0 border-b border-border-light bg-surface-primary px-4 py-4 sm:px-5">
          <Input
            label="Search customers"
            name="customer-search"
            className="p-2"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by name, email or phone..."
          />

          <div className="mt-4">
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide">
              Filter
            </Label>

            <div className="flex flex-wrap gap-1.5">
              {["All", "New", "Active", "Repeat", "VIP"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`
        rounded-lg px-3 py-1.5
        text-xs font-medium
        transition-colors
        ${activeFilter === filter
                      ? "bg-primary text-white shadow-sm"
                      : "text-black hover:bg-primary/10 hover:text-primary"
                    }
      `}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          {(error || !isOnline) &&
            customers.length > 0 && (
              <div className="mb-3 rounded-xl border border-warning/20 bg-warning/5 p-3">
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                    <AlertTriangle
                      size={14}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text-primary">
                      {!isOnline
                        ? "You're offline"
                        : "Customer data needs attention"}
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-text-muted">
                      {!isOnline
                        ? "Showing your saved customer data."
                        : error}
                    </p>
                  </div>

                  {isOnline && error && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refetch}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            )}

          {error &&
            customers.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={AlertCircle}
                title="Failed to load customers"
                description={error}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetch}
                  >
                    Retry
                  </Button>
                }
              />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Users}
                title="No customers found"
                description={
                  search
                    ? "Try another search term."
                    : "Try another customer filter."
                }
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredCustomers.map(
                (customer) => (
                  <CustomerListItem
                    key={customer.id}
                    customer={customer}
                    isActive={
                      customer.id ===
                      selectedCustomerId
                    }
                    onClick={() =>
                      handleSelectCustomer(
                        customer.id
                      )
                    }
                    currency={currency}
                  />
                )
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ===================================================
          DETAIL PANEL
      =================================================== */}

      <section
        className={`
          min-w-0 flex-1 flex-col
          ${mobileShowDetails
            ? "flex"
            : "hidden lg:flex"
          }
        `}
      >
        {selectedCustomer ? (
          <>
            {/* Detail Header */}
            <header className="shrink-0 border-b border-border-light bg-surface-primary px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Back to customers"
                    onClick={() =>
                      setMobileShowDetails(false)
                    }
                  >
                    <ArrowLeft size={18} />
                  </Button>

                  <Avatar
                    name={getTelegramDisplayName(
                      selectedCustomer
                    )}
                    size="md"
                    online={
                      selectedCustomer.online
                    }
                  />

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-text-primary">
                      {getTelegramDisplayName(
                        selectedCustomer
                      )}
                    </h2>

                    <p className="truncate text-xs text-text-muted">
                      Customer since{" "}
                      {getCustomerValue(
                        selectedCustomer.joined
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <Badge
                    variant={
                      statusVariants[
                      selectedCustomer.status
                      ] || "default"
                    }
                  >
                    {selectedCustomer.status ||
                      "Customer"}
                  </Badge>

                  <Badge
                    variant={
                      channelVariants[
                      selectedCustomer.channel
                      ] || "default"
                    }
                    className="hidden sm:inline-flex"
                  >
                    {selectedCustomer.channel ||
                      "Unknown"}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="More options"
                  >
                    <MoreHorizontal
                      size={18}
                    />
                  </Button>
                </div>
              </div>
            </header>

            {/* Detail Content */}
            <main className="min-h-0 flex-1 overflow-y-auto bg-bg-primary p-4 sm:p-6">
              <div className="mx-auto w-full max-w-6xl space-y-6">
                {/* Profile + Stats */}
                <div className="grid gap-3 lg:grid-cols-1">
                  {/* Profile */}
                  <Card className="lg:col-span-2">
                    <CardHeader
                      title="Profile"
                      subtitle="Contact & location"
                    />

                    <CardContent className="space-y-5">
                      <div className="flex items-center gap-4">
                        <Avatar
                          name={getTelegramDisplayName(
                            selectedCustomer
                          )}
                          size="xl"
                          online={
                            selectedCustomer.online
                          }
                        />

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-text-primary">
                            {getTelegramDisplayName(
                              selectedCustomer
                            )}
                          </h3>

                          <p className="mt-0.5 truncate text-sm text-text-muted">
                            {getCustomerValue(
                              selectedCustomer.location,
                              "Location not provided"
                            )}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                statusVariants[
                                selectedCustomer
                                  .status
                                ] || "default"
                              }
                            >
                              {selectedCustomer.status ||
                                "Customer"}
                            </Badge>

                            <Badge
                              variant={
                                channelVariants[
                                selectedCustomer
                                  .channel
                                ] || "default"
                              }
                            >
                              {selectedCustomer.channel ||
                                "Unknown"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Divider />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <ContactRow
                          icon={Phone}
                          value={getCustomerValue(
                            selectedCustomer.phone,
                            "No phone number"
                          )}
                        />

                        <ContactRow
                          icon={Mail}
                          value={getCustomerValue(
                            selectedCustomer.email,
                            "No email address"
                          )}
                        />

                        <ContactRow
                          icon={MapPin}
                          value={getCustomerValue(
                            selectedCustomer.location,
                            "No location"
                          )}
                        />

                        <ContactRow
                          icon={CalendarDays}
                          value={`Joined ${getCustomerValue(
                            selectedCustomer.joined
                          )}`}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats */}
                  <Card>
                    <CardHeader
                      title="Customer stats"
                      subtitle="Activity overview"
                    />

                    <CardContent className="space-y-1">
                      <StatCardMini
                        label="Orders"
                        value={
                          selectedCustomer.orders ??
                          0
                        }
                        valueColor="text-primary"
                      />

                      <StatCardMini
                        label="Total spent"
                        value={getTotalSpent(
                          selectedCustomer,
                          currency
                        )}
                        valueColor="text-success"
                      />

                      <StatCardMini
                        label="Conversations"
                        value={
                          selectedCustomer.conversations ??
                          0
                        }
                        valueColor="text-primary"
                      />

                      <StatCardMini
                        label="Last interaction"
                        value={getCustomerValue(
                          selectedCustomer.lastInteraction
                        )}
                        description={`Via ${selectedCustomer.channel ||
                          "—"
                          }`}
                        valueColor="text-text-secondary"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Orders + Products */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Orders */}
                  <Card>
                    <CardHeader
                      title="Recent orders"
                      subtitle={`${selectedCustomer.orders ??
                        0
                        } total ${selectedCustomer.orders ===
                          1
                          ? "order"
                          : "orders"
                        }`}
                      action="View all"
                      accent="primary"
                    />

                    <CardContent>
                      {!selectedCustomer.ordersList ||
                        selectedCustomer
                          .ordersList.length ===
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
                                className="flex items-center gap-3 rounded-xl border border-border-light bg-surface-muted/50 p-3 transition hover:border-primary/20 hover:shadow-sm"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <ShoppingBag
                                    size={16}
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-text-primary">
                                    {
                                      order.product
                                    }
                                  </p>

                                  <p className="text-xs text-text-muted">
                                    {order.id}{" "}
                                    •{" "}
                                    {order.date}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-sm font-bold text-text-primary">
                                    {
                                      order.amount
                                    }
                                  </p>

                                  <Badge
                                    variant={
                                      order.status ===
                                        "Completed"
                                        ? "success"
                                        : "warning"
                                    }
                                    className="mt-1"
                                  >
                                    {
                                      order.status
                                    }
                                  </Badge>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Products */}
                  <Card>
                    <CardHeader
                      title="Products"
                      subtitle="Purchased or discussed"
                      accent="default"
                    />

                    <CardContent>
                      {!selectedCustomer.products ||
                        selectedCustomer.products
                          .length === 0 ? (
                        <EmptyState
                          icon={ShoppingBag}
                          title="No products yet"
                          description="Products will appear here after customer activity."
                        />
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {selectedCustomer.products.map(
                            (product) => (
                              <div
                                key={
                                  product.name
                                }
                                className="flex items-center gap-3 rounded-xl border border-border-light bg-surface-muted/50 p-3 transition hover:border-primary/20 hover:shadow-sm"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <ShoppingBag
                                    size={16}
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-text-primary">
                                    {
                                      product.name
                                    }
                                  </p>

                                  <p className="text-xs text-text-muted">
                                    {
                                      product.price
                                    }
                                  </p>
                                </div>

                                <ChevronRight
                                  size={14}
                                  className="text-text-muted"
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Conversation History */}
                <Card>
                  <CardHeader
                    title="Conversation history"
                    subtitle="Previous interactions with this customer"
                    action="Open Inbox"
                    accent="info"
                  />

                  <CardContent className="p-0">
                    {!selectedCustomer
                      .conversationsList ||
                      selectedCustomer
                        .conversationsList
                        .length === 0 ? (
                      <div className="p-6">
                        <EmptyState
                          icon={
                            MessageSquare
                          }
                          title="No conversations yet"
                          description="Previous conversations with this customer will appear here."
                        />
                      </div>
                    ) : (
                      <div className="divide-y divide-border-light">
                        {selectedCustomer.conversationsList.map(
                          (
                            conversation,
                            index
                          ) => (
                            <button
                              key={`${conversation.date}-${index}`}
                              type="button"
                              className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-primary/5 sm:px-5"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
                                <MessageSquare
                                  size={16}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant={
                                      channelVariants[
                                      conversation
                                        .channel
                                      ] ||
                                      "default"
                                    }
                                    className="text-[10px]"
                                  >
                                    {
                                      conversation.channel
                                    }
                                  </Badge>

                                  <span className="text-xs text-text-muted">
                                    {
                                      conversation.date
                                    }
                                  </span>
                                </div>

                                <p className="mt-1 truncate text-sm font-medium text-text-primary">
                                  {
                                    conversation.preview
                                  }
                                </p>

                                <p className="mt-1 text-xs text-text-muted">
                                  {
                                    conversation.status
                                  }
                                </p>
                              </div>

                              <ChevronRight
                                size={14}
                                className="shrink-0 text-text-muted"
                              />
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Insight */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Sparkles
                          size={18}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm">
                            Customer insight
                          </CardTitle>

                          <Badge variant="default">
                            AI
                          </Badge>
                        </div>

                        <p className="mt-1 text-xs text-text-muted">
                          Useful information from
                          customer activity
                        </p>

                        <p className="mt-3 text-sm leading-6 text-text-secondary">
                          {selectedCustomer.notes ||
                            "No insights available yet."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Internal Notes */}
                <Card>
                  <CardHeader
                    title="Internal notes"
                    subtitle="Visible only to the seller and authorized team members"
                    action="Edit"
                    accent="warning"
                  />

                  <CardContent className="p-5">
                    <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                      <p className="text-sm leading-6 text-text-secondary">
                        {selectedCustomer.notes ||
                          "No internal notes."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-bg-primary p-4">
            <Card className="w-full max-w-md p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Users
                  size={30}
                  className="text-primary"
                />
              </div>

              <CardTitle>
                No customer selected
              </CardTitle>

              <CardDescription className="mx-auto mt-2 max-w-sm">
                Select a customer from the
                list to view their details.
              </CardDescription>
            </Card>
          </div>
        )}
      </section>

      {/* ===================================================
          CREATE CUSTOMER MODAL
      =================================================== */}

      {showCreateModal && (
        <CreateCustomerModal
          newCustomerData={newCustomerData}
          setNewCustomerData={
            setNewCustomerData
          }
          handleCreateCustomer={
            handleCreateCustomer
          }
          setShowCreateModal={
            setShowCreateModal
          }
        />
      )}
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
  variant = "default",
}) => {
  const variantStyles = {
    default: {
      bg: "bg-primary/5",
      icon: "text-primary",
      value: "text-primary",
    },

    success: {
      bg: "bg-success/10",
      icon: "text-success",
      value: "text-success",
    },

    warning: {
      bg: "bg-warning/10",
      icon: "text-warning",
      value: "text-warning",
    },

    error: {
      bg: "bg-error/10",
      icon: "text-error",
      value: "text-error",
    },

    info: {
      bg: "bg-info/10",
      icon: "text-info",
      value: "text-info",
    },
  };

  const styles =
    variantStyles[variant] ||
    variantStyles.default;

  return (
    <Card
      className={`${styles.bg} border-border-light`}
    >
      <div className="p-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-text-muted">
            {label}
          </p>

          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
          >
            <Icon
              size={16}
              strokeWidth={2}
            />
          </div>
        </div>

        <p
          className={`mt-2 text-xl font-bold ${styles.value}`}
        >
          {value}
        </p>
      </div>
    </Card>
  );
};

/* =========================================================
   MINI STAT
========================================================= */

const StatCardMini = ({
  label,
  value,
  description,
  valueColor,
}) => (
  <div className="flex items-center justify-between gap-4 border-b border-border-light px-3 py-2.5 last:border-0">
    <span className="text-xs text-text-muted">
      {label}
    </span>

    <div className="text-right">
      <p
        className={`text-sm font-bold ${valueColor}`}
      >
        {value}
      </p>

      {description && (
        <p className="text-[10px] text-text-muted">
          {description}
        </p>
      )}
    </div>
  </div>
);

/* =========================================================
   CUSTOMER LIST ITEM
========================================================= */

const CustomerListItem = ({
  customer,
  isActive,
  onClick,
  currency,
}) => {
  const displayName =
    getTelegramDisplayName(customer);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group w-full rounded-xl p-3 text-left
        transition-all
        ${isActive
          ? "border-l-4 border-primary bg-primary/5 pl-2"
          : "border-l-4 border-transparent hover:bg-surface-muted"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Avatar
          name={displayName}
          size="sm"
          online={customer.online}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold text-text-primary">
              {displayName}
            </p>

            <span className="shrink-0 text-[10px] font-medium text-text-muted">
              {getCustomerValue(
                customer.lastInteraction
              )}
            </span>
          </div>

          <p className="mt-0.5 truncate text-xs text-text-muted">
            {getCustomerValue(
              customer.email,
              "No email"
            )}
          </p>

          <div className="mt-2 flex min-w-0 items-center gap-2">
            <Badge
              variant={
                statusVariants[
                customer.status
                ] || "default"
              }
              className="text-[10px]"
            >
              {customer.status || "Customer"}
            </Badge>

            <span className="truncate text-[10px] font-medium text-text-muted">
              {customer.orders ?? 0}{" "}
              {customer.orders === 1
                ? "order"
                : "orders"}
            </span>

            <span className="shrink-0 text-text-muted">
              •
            </span>

            <span className="truncate text-[10px] font-medium text-text-muted">
              {getTotalSpent(
                customer,
                currency
              )}
            </span>
          </div>
        </div>

        <ChevronRight
          size={14}
          className={`
            shrink-0 transition
            ${isActive
              ? "text-primary"
              : "text-text-muted group-hover:translate-x-0.5 group-hover:text-primary"
            }
          `}
        />
      </div>
    </button>
  );
};

/* =========================================================
   CONTACT ROW
========================================================= */

const ContactRow = ({
  icon: Icon,
  value,
}) => (
  <div className="flex min-w-0 items-center gap-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
      <Icon
        size={14}
        className="text-text-muted"
      />
    </div>

    <span className="truncate text-xs font-medium text-text-secondary">
      {value}
    </span>
  </div>
);

/* =========================================================
   CREATE CUSTOMER MODAL
========================================================= */

const CreateCustomerModal = ({
  newCustomerData,
  setNewCustomerData,
  handleCreateCustomer,
  setShowCreateModal,
}) => {
  const updateField = (
    field,
    value
  ) => {
    setNewCustomerData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <Card className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden">
        {/* Modal Header */}
        <CardHeader className="shrink-0 border-b border-border-light pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users size={18} />
              </div>

              <div className="min-w-0">
                <CardTitle>
                  Add customer
                </CardTitle>

                <CardDescription className="mt-1 text-xs">
                  Add a customer to your ThreadOS
                  workspace.
                </CardDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close"
              onClick={() =>
                setShowCreateModal(false)
              }
            >
              <X size={17} />
            </Button>
          </div>
        </CardHeader>

        {/* Form */}
        <form
          onSubmit={handleCreateCustomer}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <CardContent className="space-y-7 p-4 sm:p-6">
            {/* Customer Information */}
            <section>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-primary" />

                  <h3 className="text-sm font-semibold text-text-primary">
                    Customer information
                  </h3>
                </div>

                <p className="mt-1.5 pl-3 text-xs leading-5 text-text-muted">
                  Add the customer's basic
                  contact details.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Customer name"
                  name="name"
                  className="p-2"
                  value={
                    newCustomerData.name
                  }
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Ama Mensah"
                  required
                  autoFocus
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone number"
                    name="phone"
                    className="p-2"
                    type="tel"
                    value={
                      newCustomerData.phone
                    }
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+233 24 123 4567"
                  />

                  <Input
                    label="Email address"
                    name="email"
                    type="email"
                    className="p-2"
                    value={
                      newCustomerData.email
                    }
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="customer@example.com"
                  />
                </div>

                <Input
                  label="Location"
                  name="location"
                  className="p-2"
                  value={
                    newCustomerData.location
                  }
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Accra, Ghana"
                />
              </div>
            </section>

            {/* Customer Source */}
            <section className="border-t border-border-light pt-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-primary" />

                  <h3 className="text-sm font-semibold text-text-primary">
                    Customer source
                  </h3>
                </div>

                <p className="mt-1.5 pl-3 text-xs leading-5 text-text-muted">
                  Select the channel where this
                  customer came from.
                </p>
              </div>

              <Select
                label="Primary channel"
                name="channel"
                className="p-2"
                value={
                  newCustomerData.channel
                }
                onChange={(event) =>
                  updateField(
                    "channel",
                    event.target.value
                  )
                }
                options={[
                  {
                    value: "Website",
                    label: "Website",
                  },
                  {
                    value: "WhatsApp",
                    label: "WhatsApp",
                  },
                  {
                    value: "Instagram",
                    label: "Instagram",
                  },
                  {
                    value: "Facebook",
                    label: "Facebook",
                  },
                  {
                    value: "Telegram",
                    label: "Telegram",
                  },
                ]}
              />

              <div className="mt-3 flex items-start gap-3 rounded-lg border border-primary/10 bg-primary/[0.04] px-3.5 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <MessageCircle
                    size={14}
                    className="text-primary"
                  />
                </div>

                <div>
                  <p className="text-xs font-medium text-text-primary">
                    Channel tracking
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-text-muted">
                    ThreadOS uses this to
                    organize conversations
                    and customer activity by
                    channel.
                  </p>
                </div>
              </div>
            </section>

            {/* Internal Notes */}
            <section className="border-t border-border-light pt-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-1 rounded-full bg-primary" />

                  <h3 className="text-sm font-semibold text-text-primary">
                    Internal notes
                  </h3>
                </div>

                <p className="mt-1.5 pl-3 text-xs leading-5 text-text-muted">
                  Keep useful information
                  about this customer for
                  you or your team.
                </p>
              </div>

              <Textarea
                label="Notes"
                name="notes"
                className="p-2"
                value={
                  newCustomerData.notes
                }
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="e.g. Prefers WhatsApp, interested in new arrivals..."
              />

              <p className="mt-2 text-[11px] text-text-muted">
                Internal only — customers will
                not see these notes.
              </p>
            </section>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex shrink-0 flex-col gap-3 border-t border-border-light bg-surface-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="hidden text-[11px] text-text-muted sm:block">
              <span className="text-error">
                *
              </span>{" "}
              Required field
            </p>

            <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="w-full sm:min-w-[100px] sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  !newCustomerData.name.trim()
                }
                className="w-full sm:min-w-[150px] sm:w-auto"
              >
                <Plus size={16} />

                <span>
                  Create customer
                </span>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Customers;