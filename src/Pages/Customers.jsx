import { useMemo, useState, useEffect } from "react";
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
  if (customer.channel !== "Telegram" && customer.channel !== "telegram") {
    return customer.name || "Unknown customer";
  }
  if (customer.telegram_username) {
    const username = customer.telegram_username;
    return username.startsWith("@") ? username : `@${username}`;
  }
  const firstName = customer.telegram_first_name || "";
  const lastName = customer.telegram_last_name || "";
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  return customer.name || "Unknown customer";
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
    isOnline,
  } = useCustomers();

  const { settings } = useSettings();

  const currency = settings?.general?.currency || "GHS";

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [search] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

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
      const timer = setTimeout(() => {
        setSelectedCustomerId(customers[0].id);
      }, 0);
      return () => clearTimeout(timer);
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
     RENDER
  ========================================================= */

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-text-muted">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (!selectedCustomer) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg-primary">
        <Card className="w-full max-w-md text-center p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Users size={30} className="text-primary" />
          </div>
          <CardTitle>{customers.length === 0 ? "No customers yet" : "No customer selected"}</CardTitle>
          <CardDescription className="mx-auto mt-2 max-w-sm">
            {customers.length === 0
              ? "Customers you create will appear here."
              : "Select a customer to view their details."}
          </CardDescription>
          {customers.length === 0 && (
            <Button onClick={() => setShowCreateModal(true)} className="mt-4 w-full">
              <Plus size={16} />
              <span>Add your first customer</span>
            </Button>
          )}
          {showCreateModal && (
            <CreateCustomerModal
              newCustomerData={newCustomerData}
              setNewCustomerData={setNewCustomerData}
              handleCreateCustomer={handleCreateCustomer}
              setShowCreateModal={setShowCreateModal}
            />
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-bg-primary">
      {/* Customer List Sidebar */}
      <aside className="lg:w-96 flex-shrink-0 border-r border-border-light bg-surface-primary flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border-light bg-surface-primary/50 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Users size={20} strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">Customers</h1>
                <p className="text-sm text-text-muted">{totalCustomers} {totalCustomers === 1 ? "customer" : "customers"}</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)} size="md">
              <Plus size={16} />
              <span>Add Customer</span>
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="border-b border-border-light bg-surface-primary/50 px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Users} label="Total" value={totalCustomers} />
            <StatCard icon={UserRound} label="Active" value={activeCustomers} variant="success" />
            <StatCard icon={Sparkles} label="Repeat" value={repeatCustomers} variant="warning" />
            <StatCard icon={Plus} label="New" value={newCustomers} variant="info" />
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border-light bg-surface-primary/50 px-4 py-4 sm:px-6">
          <Label className="text-sm font-medium text-text-muted mb-2 block">Filter</Label>
          <div className="flex flex-wrap gap-2">
            {["All", "New", "Active", "Repeat", "VIP"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activeFilter === filter
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-text-muted hover:bg-surface-muted hover:text-text-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center space-y-3">
                <Spinner size="lg" />
                <p className="text-sm font-medium text-text-muted">Loading customers...</p>
              </div>
            </div>
          ) : error && customers.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState
                icon={AlertCircle}
                title="Failed to load customers"
                description={error}
                action={<Button variant="outline" size="sm" onClick={refetch}>Retry</Button>}
              />
            </div>
          ) : (
            <>
              {(error || !isOnline) && customers.length > 0 && (
                <div className="mb-4 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                      <AlertTriangle size={14} />
                    </span>
                    <span>{!isOnline ? "Offline — showing saved data" : error}</span>
                    {isOnline && error && (
                      <Button variant="ghost" size="sm" className="ml-auto" onClick={refetch}>
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState
                icon={Users}
                title="No customers found"
                description="Try another search or filter."
              />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCustomers.map((customer) => (
                <CustomerListItem
                  key={customer.id}
                  customer={customer}
                  isActive={customer.id === selectedCustomerId}
                  onClick={() => {
                    handleSelectCustomer(customer.id);
                  }}
                  currency={currency}
                />
              ))}
            </div>
          )}
          </>
          )}
        </div>
      </aside>

      {/* Customer Detail Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedCustomer ? (
          <>
            {/* Detail Header */}
            <header className="border-b border-border-light bg-surface-primary px-4 py-3 sm:px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Back">
                    <ArrowLeft size={18} />
                  </Button>
                  <Avatar name={getTelegramDisplayName(selectedCustomer)} size="md" online={selectedCustomer.online} />
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-text-primary">{getTelegramDisplayName(selectedCustomer)}</h2>
                    <p className="text-sm text-text-muted">Customer since {selectedCustomer.joined}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[selectedCustomer.status] || "default"}>
                    {selectedCustomer.status}
                  </Badge>
                  <Badge variant={channelVariants[selectedCustomer.channel] || "default"}>
                    {selectedCustomer.channel}
                  </Badge>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreHorizontal size={18} />
                  </Button>
                </div>
              </div>
            </header>

            {/* Detail Content */}
            <main className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto w-full">
                {/* Profile + Contact */}
                <Card className="lg:col-span-2">
                  <CardHeader title="Profile" subtitle="Contact & location" />
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar name={getTelegramDisplayName(selectedCustomer)} size="xl" online={selectedCustomer.online} />
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-text-primary truncate">{getTelegramDisplayName(selectedCustomer)}</h3>
                        <p className="text-sm text-text-muted truncate">{selectedCustomer.location}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant={statusVariants[selectedCustomer.status] || "default"}>
                            {selectedCustomer.status}
                          </Badge>
                          <Badge variant={channelVariants[selectedCustomer.channel] || "default"}>
                            {selectedCustomer.channel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Divider />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ContactRow icon={Phone} value={selectedCustomer.phone} />
                      <ContactRow icon={Mail} value={selectedCustomer.email} />
                      <ContactRow icon={MapPin} value={selectedCustomer.location} />
                      <ContactRow icon={CalendarDays} value={`Joined ${selectedCustomer.joined}`} />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <Card className="lg:col-span-1">
                  <CardHeader title="Stats" subtitle="Overview" />
                  <CardContent className="space-y-4">
                    <StatCardMini label="Orders" value={selectedCustomer.orders} valueColor="text-primary" />
                    <StatCardMini label="Total spent" value={typeof selectedCustomer.totalSpent === "number" ? `${currency} ${selectedCustomer.totalSpent}` : selectedCustomer.totalSpent || `${currency} 0`} valueColor="text-success" />
                    <StatCardMini label="Conversations" value={selectedCustomer.conversations} valueColor="text-primary" />
                    <StatCardMini label="Last interaction" value={selectedCustomer.lastInteraction || "—"} description={`Via ${selectedCustomer.channel || "—"}`} valueColor="text-text-secondary" />
                  </CardContent>
                </Card>
              </div>

              {/* Orders + Products */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Orders */}
                <Card>
                  <CardHeader title="Recent orders" subtitle={`${selectedCustomer.orders} total ${selectedCustomer.orders === 1 ? "order" : "orders"}`} action="View all" accent="primary" />
                  <CardContent className="space-y-3">
                    {selectedCustomer.ordersList.length === 0 ? (
                      <EmptyState icon={ShoppingBag} title="No orders yet" description="Orders from this customer will appear here." />
                    ) : (
                      <div className="space-y-2">
                        {selectedCustomer.ordersList.map((order) => (
                          <div key={order.id} className="flex items-center gap-3 rounded-xl border border-border-light bg-surface-muted/50 p-3 transition hover:border-primary/20 hover:shadow-sm">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <ShoppingBag size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-text-primary">{order.product}</p>
                              <p className="text-xs text-text-muted">{order.id} • {order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-text-primary">{order.amount}</p>
                              <Badge variant={order.status === "Completed" ? "success" : "warning"} className="mt-1">{order.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Products */}
                <Card>
                  <CardHeader title="Products" subtitle="Purchased or discussed" accent="default" />
                  <CardContent>
                    {selectedCustomer.products.length === 0 ? (
                      <EmptyState icon={ShoppingBag} title="No products yet" description="Products will appear here after customer activity." />
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {selectedCustomer.products.map((product) => (
                          <div key={product.name} className="flex items-center gap-3 rounded-xl border border-border-light bg-surface-muted/50 p-3 transition hover:border-primary/20 hover:shadow-sm">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <ShoppingBag size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-text-primary">{product.name}</p>
                              <p className="text-xs text-text-muted">{product.price}</p>
                            </div>
                            <ChevronRight size={14} className="text-text-muted" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Conversation History */}
              <Card>
                <CardHeader title="Conversation history" subtitle="Previous interactions with this customer" action="Open Inbox" accent="info" />
                <CardContent className="p-0">
                  <div className="divide-y divide-border-light">
                    {selectedCustomer.conversationsList.map((conversation, index) => (
                      <button key={`${conversation.date}-${index}`} type="button" className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-primary/5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
                          <MessageSquare size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={channelVariants[conversation.channel] || "default"} className="text-xs">{conversation.channel}</Badge>
                            <span className="text-xs text-text-muted">{conversation.date}</span>
                          </div>
                          <p className="mt-1 truncate text-sm font-medium text-text-primary">{conversation.preview}</p>
                          <p className="mt-1 text-xs text-text-muted">{conversation.status}</p>
                        </div>
                        <ChevronRight size={14} className="text-text-muted" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Insight */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Sparkles size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Customer insight</CardTitle>
                        <Badge variant="default">AI</Badge>
                      </div>
                      <p className="mt-1 text-xs text-text-muted">Useful information from customer activity</p>
                      <p className="mt-3 text-sm text-text-secondary">{selectedCustomer.notes || "No insights available."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Notes */}
              <Card>
                <CardHeader title="Internal notes" subtitle="Visible only to the seller and authorized team members" action="Edit" accent="warning" />
                <CardContent className="p-5">
                  <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                    <p className="text-sm text-text-secondary">{selectedCustomer.notes || "No internal notes."}</p>
                  </div>
                </CardContent>
              </Card>
            </main>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-primary">
            <Card className="w-full max-w-md text-center p-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Users size={30} className="text-primary" />
              </div>
              <CardTitle>{customers.length === 0 ? "No customers yet" : "No customer selected"}</CardTitle>
              <CardDescription className="mx-auto mt-2 max-w-sm">
                {customers.length === 0
                  ? "Customers you create will appear here."
                  : "Select a customer to view their details."}
              </CardDescription>
              {customers.length === 0 && (
                <Button onClick={() => setShowCreateModal(true)} className="mt-4 w-full">
                  <Plus size={16} />
                  <span>Add your first customer</span>
                </Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ icon: Icon, label, value, variant = "default" }) => {
  const variantStyles = {
    default: { bg: "bg-primary/5", icon: "text-primary", value: "text-primary" },
    success: { bg: "bg-success/10", icon: "text-success", value: "text-success" },
    warning: { bg: "bg-warning/10", icon: "text-warning", value: "text-warning" },
    error: { bg: "bg-error/10", icon: "text-error", value: "text-error" },
    info: { bg: "bg-info/10", icon: "text-info", value: "text-info" },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <Card className={`${styles.bg} border-border-light`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-text-muted">{label}</p>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}>
            <Icon size={17} strokeWidth={2} />
          </div>
        </div>
        <p className={`mt-2 text-2xl font-bold ${styles.value}`}>{value}</p>
      </div>
    </Card>
  );
};

/* =========================================================
   STAT CARD MINI
========================================================= */

const StatCardMini = ({ label, value, description, valueColor }) => (
  <div className="flex items-center justify-between gap-4 border-b border-border-light last:border-0 px-3 py-2">
    <span className="text-xs text-text-muted">{label}</span>
    <div className="text-right">
      <p className={`text-sm font-bold ${valueColor}`}>{value}</p>
      <p className="text-[10px] text-text-muted">{description}</p>
    </div>
  </div>
);

/* =========================================================
   CUSTOMER LIST ITEM
========================================================= */

const CustomerListItem = ({ customer, isActive, onClick, currency }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      group w-full text-left transition-all rounded-xl p-3
      ${isActive
        ? "bg-primary/5 border-l-4 border-primary"
        : "hover:bg-surface-muted"
    }`}
  >
    <div className="flex items-center gap-3">
      <Avatar name={getTelegramDisplayName(customer)} size="sm" online={customer.online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-text-primary">{getTelegramDisplayName(customer)}</p>
          <span className="shrink-0 text-[10px] font-medium text-text-muted">{customer.lastInteraction}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-text-muted">{customer.email}</p>
        <div className="mt-2 flex min-w-0 items-center gap-2">
          <Badge variant={statusVariants[customer.status] || "default"} className="text-[10px]">{customer.status}</Badge>
          <span className="truncate text-[10px] font-medium text-text-muted">{customer.orders} {customer.orders === 1 ? "order" : "orders"}</span>
          <span className="shrink-0 text-text-muted">•</span>
          <span className="truncate text-[10px] font-medium text-text-muted">
            {typeof customer.totalSpent === "number" ? `${currency} ${customer.totalSpent}` : customer.totalSpent || `${currency} 0`}
          </span>
        </div>
      </div>
      <ChevronRight size={14} className={`shrink-0 transition ${isActive ? "text-primary" : "text-text-muted group-hover:translate-x-0.5 group-hover:text-primary"}`} />
    </div>
  </button>
);

/* =========================================================
   CONTACT ROW
========================================================= */

const ContactRow = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted">
      <Icon size={14} className="text-text-muted" />
    </div>
    <span className="truncate text-xs font-medium text-text-secondary">{value}</span>
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <CardHeader className="pb-0 border-b border-border-light">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add Customer</CardTitle>
              <CardDescription className="text-xs">Add a new customer to your workspace.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)}>
              <X size={17} />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleCreateCustomer} className="flex-1 overflow-y-auto">
          <CardContent className="p-5 space-y-4">
            <Input label="Customer name" name="name" value={newCustomerData.name} onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})} placeholder="Customer name" required autoFocus />
            <Input label="Phone" name="phone" type="tel" value={newCustomerData.phone} onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})} placeholder="+233 24 123 4567" />
            <Input label="Email" name="email" type="email" value={newCustomerData.email} onChange={e => setNewCustomerData({...newCustomerData, email: e.target.value})} placeholder="customer@example.com" />
            <Input label="Location" name="location" value={newCustomerData.location} onChange={e => setNewCustomerData({...newCustomerData, location: e.target.value})} placeholder="Accra, Ghana" />
            <Select
              label="Channel"
              name="channel"
              value={newCustomerData.channel}
              onChange={e => setNewCustomerData({...newCustomerData, channel: e.target.value})}
              options={[
                { value: "Website", label: "Website" },
                { value: "WhatsApp", label: "WhatsApp" },
                { value: "Instagram", label: "Instagram" },
                { value: "Facebook", label: "Facebook" },
                { value: "Telegram", label: "Telegram" },
              ]}
            />
            <Textarea label="Notes" name="notes" value={newCustomerData.notes} onChange={e => setNewCustomerData({...newCustomerData, notes: e.target.value})} rows={3} placeholder="Internal notes about this customer" />
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" disabled={!newCustomerData.name.trim()}>
              <Plus size={16} />
              <span>Create Customer</span>
            </Button>
          </CardFooter>
        </form>
</Card>
    </div>
  );
};

export default Customers;