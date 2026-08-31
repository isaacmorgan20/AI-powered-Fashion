import React, { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Store,
  Bot,
  MessageSquare,
  Bell,
  Globe,
  BookOpen,
  Users,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Upload,
  Plus,
  Trash2,
  Eye,
  Smartphone,
  MessageCircle,
  Save,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Database,
  Lock,
  LogOut,
  Mail,
  UserRound,
  Info,
  AlertTriangle,
  BarChart3,
  CircleDollarSign,
  Package,
  Share2,
  Loader2,
  X,
} from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import useAuthStore from "../Store/AuthStore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../service/Firebase";

/* =========================================================
   SETTINGS SECTIONS
========================================================= */

const settingsSections = [
  {
    id: "general",
    label: "General",
    description: "Business information",
    icon: Store,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme and display",
    icon: Palette,
  },
  {
    id: "ai",
    label: "AI & Automation",
    description: "Control your AI assistant",
    icon: Bot,
  },
  {
    id: "customer",
    label: "Customer Experience",
    description: "Customer-facing behavior",
    icon: MessageSquare,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts and updates",
    icon: Bell,
  },
  {
    id: "channels",
    label: "Channels",
    description: "Connected platforms",
    icon: Globe,
  },
  {
    id: "storefront",
    label: "Storefront",
    description: "Public shopping experience",
    icon: ShoppingBag,
  },
  {
    id: "knowledge",
    label: "Knowledge Base",
    description: "Information used by AI",
    icon: BookOpen,
  },
  {
    id: "team",
    label: "Team & Access",
    description: "Members and permissions",
    icon: Users,
  },
  {
    id: "security",
    label: "Security",
    description: "Account and security",
    icon: Shield,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const Settings = () => {
  const { settings, loading, error, saving, updateSettings, refetch } = useSettings();
  const profile = useAuthStore((s) => s.profile);

  /* =======================================================
     GENERAL
  ======================================================= */

  const [general, setGeneral] = useState({
    businessName: "",
    businessCategory: "Fashion & Apparel",
    currency: "GHS",
    timezone: "Africa/Accra",
    language: "English",
    businessEmail: "",
    businessPhone: "",
  });

  /* =======================================================
     APPEARANCE - Real Firebase-backed, single source of truth
  ======================================================= */

  const theme = settings?.appearance?.theme || "system";
  const compact = settings?.appearance?.compact || false;
  const setTheme = (newTheme) => {
    const currentCompact = settings?.appearance?.compact || false;
    updateSettings({ appearance: { theme: newTheme, compact: currentCompact } });
  };
  const setCompact = (newCompact) => {
    const currentTheme = settings?.appearance?.theme || "system";
    updateSettings({ appearance: { theme: currentTheme, compact: newCompact } });
  };

  /* =======================================================
     AI
  ======================================================= */

  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    autoReply: true,
    productRecommendations: true,
    customerMemory: true,
    humanHandoff: true,
    orderAssistance: true,
    responseStyle: "Professional",
    confidenceThreshold: "Medium",
  });

  /* =======================================================
     CUSTOMER EXPERIENCE
  ======================================================= */

  const [customerSettings, setCustomerSettings] = useState({
    welcomeMessage: "Hi! Welcome to our store. How can we help you today?",
    orderConfirmation: "Your order has been received and is being processed.",
    showProductRecommendations: true,
    showAvailability: true,
    allowCustomerChat: true,
    allowGuestCheckout: true,
    collectPhone: true,
    collectEmail: false,
  });

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [notifications, setNotifications] = useState({
    newConversation: true,
    humanHandoff: true,
    newOrder: true,
    lowStock: true,
    dailySummary: true,
    emailNotifications: true,
    browserNotifications: true,
  });

  /* =======================================================
     CHANNELS
  ======================================================= */

  const [channels, setChannels] = useState({
    whatsapp: true,
    instagram: true,
    facebook: false,
    website: true,
  });

  /* =======================================================
     STOREFRONT
  ======================================================= */

  const [storefront, setStorefront] = useState({
    enabled: true,
    storeName: "",
    storeDescription: "Discover quality fashion, dresses, shoes and accessories.",
    showPrices: true,
    showStock: true,
    showCustomerChat: true,
    showAiAssistant: true,
    allowOrdering: true,
    allowGuestBrowsing: true,
  });

  /* =======================================================
     KNOWLEDGE BASE
  ======================================================= */

  const [knowledge, setKnowledge] = useState({
    productInformation: true,
    faq: true,
    deliveryPolicy: true,
    returnPolicy: true,
    paymentPolicy: true,
    businessInformation: true,
    orderInformation: true,
  });

  /* =======================================================
     TEAM
  ======================================================= */

  const [teamMembers, setTeamMembers] = useState([]);

  /* =======================================================
     SECURITY
  ======================================================= */

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30 minutes",
  });

  // Load real seller settings from Firebase
  useEffect(() => {
    if (settings) {
      if (settings.general) setGeneral((c) => ({ ...c, ...settings.general }));
      if (settings.ai) setAiSettings((c) => ({ ...c, ...settings.ai }));
      if (settings.customer) setCustomerSettings((c) => ({ ...c, ...settings.customer }));
      if (settings.notifications) setNotifications((c) => ({ ...c, ...settings.notifications }));
      if (settings.channels) setChannels((c) => ({ ...c, ...settings.channels }));
      if (settings.storefront) setStorefront((c) => ({ ...c, ...settings.storefront }));
      if (settings.knowledge) setKnowledge((c) => ({ ...c, ...settings.knowledge }));
      if (settings.team) setTeamMembers(settings.team);
      if (settings.security) setSecurity((c) => ({ ...c, ...settings.security }));
    }
  }, [settings]);

  // Sync businessName from profile if empty
  useEffect(() => {
    if (profile && profile.businessName && !general.businessName) {
      setGeneral((c) => ({ ...c, businessName: profile.businessName, businessEmail: profile.email || c.businessEmail }));
    }
  }, [profile]);

  const [activeSection, setActiveSection] = useState("general");

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /* =======================================================
     SAVE STATE
  ======================================================= */

  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // Theme/compact are applied globally via useAppearance() in App.jsx (single source of truth)

  /* =======================================================
     SELECT SECTION
  ======================================================= */

  const handleSectionChange = (section) => {
    setActiveSection(section);

    setMobileMenuOpen(false);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    setSaveError("");
    try {
      await updateSettings({
        general,
        ai: aiSettings,
        customer: customerSettings,
        notifications,
        channels,
        storefront,
        knowledge,
        team: teamMembers,
        security,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message || "Failed to save settings");
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = async () => {
    const confirmed = window.confirm("Reset your current settings?");
    if (!confirmed) return;
    try {
      await refetch();
      setSaveError("");
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordData.current || !passwordData.newPass || !passwordData.confirm) {
      setPasswordError("All fields are required");
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordData.newPass.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Not authenticated");
      const cred = EmailAuthProvider.credential(user.email, passwordData.current);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, passwordData.newPass);
      setPasswordSuccess("Password updated successfully");
      setPasswordData({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPasswordError(err.message || "Failed to update password");
    }
  };

  /* =======================================================
     GENERAL UPDATE
  ======================================================= */

  const updateGeneral = (field, value) => {
    setGeneral((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     AI UPDATE
  ======================================================= */

  const updateAI = (field, value) => {
    setAiSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     CUSTOMER UPDATE
  ======================================================= */

  const updateCustomer = (field, value) => {
    setCustomerSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     NOTIFICATION UPDATE
  ======================================================= */

  const updateNotification = (
    field,
    value
  ) => {
    setNotifications((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     CHANNEL UPDATE
  ======================================================= */

  const updateChannel = (field, value) => {
    setChannels((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     STOREFRONT UPDATE
  ======================================================= */

  const updateStorefront = (
    field,
    value
  ) => {
    setStorefront((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     KNOWLEDGE UPDATE
  ======================================================= */

  const updateKnowledge = (
    field,
    value
  ) => {
    setKnowledge((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     SECURITY UPDATE
  ======================================================= */

  const updateSecurity = (
    field,
    value
  ) => {
    setSecurity((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     REMOVE TEAM MEMBER
  ======================================================= */

  const removeTeamMember = async (id) => {
    const confirmed = window.confirm("Remove this team member?");
    if (!confirmed) return;
    const updated = teamMembers.filter((member) => member.id !== id);
    setTeamMembers(updated);
    try {
      await updateSettings({ team: updated });
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handleAddTeamMember = async () => {
    const email = window.prompt("Enter team member email:");
    if (!email || !email.trim()) return;
    const name = window.prompt("Enter team member name:") || email.split("@")[0];
    const newMember = { id: Date.now().toString(), name: name.trim(), email: email.trim(), role: "Agent", status: "Active" };
    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    try {
      await updateSettings({ team: updated });
    } catch (err) {
      setSaveError(err.message);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  if (loading) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader2 size={28} className="mx-auto animate-spin text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-gray-50 p-6 dark:bg-gray-950">
        <div className="max-w-sm text-center">
          <AlertTriangle size={28} className="mx-auto text-red-400" />
          <h3 className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Failed to load settings</h3>
          <p className="mt-1 text-xs text-gray-400">{error}</p>
          <button onClick={refetch} className="mt-3 text-xs font-medium text-blue-600 hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <SettingsIcon
              size={19}
              strokeWidth={1.8}
              className="shrink-0 text-gray-700 dark:text-gray-300"
            />

            <h1 className="truncate text-lg font-semibold">
              Settings
            </h1>
          </div>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Control your ThreadOS AI business experience.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check size={14} />
                Saved
              </>
            ) : (
              <>
                <Save size={14} />
                Save changes
              </>
            )}
          </button>
        </div>
      </header>

      {saveError && (
        <div className="shrink-0 bg-red-50 px-4 py-2 text-xs text-red-600 dark:bg-red-950/30">
          {saveError}
        </div>
      )}

      {/* =====================================================
          MOBILE SECTION BUTTON
      ====================================================== */}

      <div className="shrink-0 border-b border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (value) => !value
            )
          }
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-3 text-left dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            {(() => {
              const current =
                settingsSections.find(
                  (section) =>
                    section.id ===
                    activeSection
                );

              const Icon = current?.icon;

              return (
                <>
                  {Icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Icon size={15} />
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold">
                      {current?.label}
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {current?.description}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          <ChevronRight
            size={16}
            className={`text-gray-400 transition ${
              mobileMenuOpen
                ? "rotate-90"
                : ""
            }`}
          />
        </button>

        {mobileMenuOpen && (
          <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            {settingsSections.map(
              (section) => {
                const Icon = section.icon;

                const active =
                  section.id ===
                  activeSection;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() =>
                      handleSectionChange(
                        section.id
                      )
                    }
                    className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${
                      active
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        active
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400"
                      }
                    />

                    <div>
                      <p className="text-xs font-medium">
                        {section.label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          MAIN SETTINGS LAYOUT
      ====================================================== */}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ===================================================
            DESKTOP SIDEBAR
        ==================================================== */}

        <aside className="hidden h-full w-[260px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:block">
          <nav className="space-y-1 p-3">
            {settingsSections.map(
              (section) => {
                const Icon = section.icon;

                const active =
                  section.id ===
                  activeSection;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() =>
                      handleSectionChange(
                        section.id
                      )
                    }
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-white shadow-sm dark:bg-gray-700"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          active
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400"
                        }
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-xs font-medium ${
                          active
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {section.label}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-gray-400">
                        {section.description}
                      </p>
                    </div>

                    {active && (
                      <ChevronRight
                        size={14}
                        className="shrink-0 text-gray-400"
                      />
                    )}
                  </button>
                );
              }
            )}
          </nav>
        </aside>

        {/* ===================================================
            SETTINGS CONTENT
        ==================================================== */}

        <main className="settings-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6">
            {/* =================================================
                GENERAL
            ================================================== */}

            {activeSection === "general" && (
              <SettingsSection
                icon={Store}
                title="General"
                description="Manage the basic information about your business."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Business name"
                    description="The name your customers see."
                  >
                    <input
                      type="text"
                      value={
                        general.businessName
                      }
                      onChange={(event) =>
                        updateGeneral(
                          "businessName",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Business category"
                    description="Used to personalize your AI experience."
                  >
                    <select
                      value={
                        general.businessCategory
                      }
                      onChange={(event) =>
                        updateGeneral(
                          "businessCategory",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option>
                        Fashion & Apparel
                      </option>
                      <option>
                        Beauty & Cosmetics
                      </option>
                      <option>
                        Electronics
                      </option>
                      <option>
                        Food & Beverage
                      </option>
                      <option>
                        Home & Lifestyle
                      </option>
                      <option>
                        Other
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Business email"
                    description="Email used for business notifications."
                  >
                    <input
                      type="email"
                      value={
                        general.businessEmail
                      }
                      onChange={(event) =>
                        updateGeneral(
                          "businessEmail",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Business phone"
                    description="Primary customer contact number."
                  >
                    <input
                      type="tel"
                      value={
                        general.businessPhone
                      }
                      onChange={(event) =>
                        updateGeneral(
                          "businessPhone",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Currency"
                    description="Currency used for your products and orders."
                  >
                    <select
                      value={
                        general.currency
                      }
                      onChange={(event) =>
                        updateGeneral(
                          "currency",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option value="GHS">
                        GHS — Ghana Cedi
                      </option>
                      <option value="USD">
                        USD — US Dollar
                      </option>
                      <option value="GBP">
                        GBP — British Pound
                      </option>
                      <option value="EUR">
                        EUR — Euro
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Time zone"
                    description="Used for business hours and notifications."
                  >
                    <select
                      value={
                        general.timezone
                      }
                      onChange={(event) =>
                        updateGeneral(
                          "timezone",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option value="Africa/Accra">
                        Africa/Accra
                      </option>
                      <option value="UTC">
                        UTC
                      </option>
                      <option value="Europe/London">
                        Europe/London
                      </option>
                      <option value="America/New_York">
                        America/New York
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Language"
                    description="Default dashboard language."
                  >
                    <select
                      value={
                        general.language
                      }
                      onChange={(event) =>
                        updateGeneral(
                          "language",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option>
                        English
                      </option>
                    </select>
                  </Field>
                </div>

                <InfoBox>
                  Business information is used throughout
                  your storefront, customer communications
                  and AI responses.
                </InfoBox>
              </SettingsSection>
            )}

            {/* =================================================
                APPEARANCE
            ================================================== */}

            {activeSection === "appearance" && (
              <SettingsSection
                icon={Palette}
                title="Appearance"
                description="Choose how ThreadOS AI looks on your device."
              >
                <div>
                  <h3 className={subHeadingClass}>
                    Theme
                  </h3>

                  <p className={descriptionClass}>
                    Choose light, dark or match your
                    system preference.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <ThemeCard
                      value="light"
                      label="Light"
                      description="Use the light interface."
                      icon={Sun}
                      selected={
                        theme === "light"
                      }
                      onClick={() =>
                        setTheme("light")
                      }
                    />

                    <ThemeCard
                      value="dark"
                      label="Dark"
                      description="Use the dark interface."
                      icon={Moon}
                      selected={
                        theme === "dark"
                      }
                      onClick={() =>
                        setTheme("dark")
                      }
                    />

                    <ThemeCard
                      value="system"
                      label="System"
                      description="Follow your device preference."
                      icon={Monitor}
                      selected={
                        theme === "system"
                      }
                      onClick={() =>
                        setTheme("system")
                      }
                    />
                  </div>
                </div>

                <Divider />

                <SettingRow
                  icon={Palette}
                  title="Compact interface"
                  description="Reduce spacing to fit more information on screen."
                >
                  <Toggle
                    checked={compact}
                    onChange={setCompact}
                  />
                </SettingRow>
              </SettingsSection>
            )}

            {/* =================================================
                AI
            ================================================== */}

            {activeSection === "ai" && (
              <SettingsSection
                icon={Bot}
                title="AI & Automation"
                description="Control how your AI assistant handles customer conversations."
              >
                <div className="space-y-2">
                  <SettingRow
                    icon={Bot}
                    title="Enable AI assistant"
                    description="Allow ThreadOS AI to respond to customers."
                  >
                    <Toggle
                      checked={
                        aiSettings.enabled
                      }
                      onChange={(value) =>
                        updateAI(
                          "enabled",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={MessageSquare}
                    title="Automatic replies"
                    description="Automatically reply to incoming customer messages."
                  >
                    <Toggle
                      checked={
                        aiSettings.autoReply
                      }
                      onChange={(value) =>
                        updateAI(
                          "autoReply",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={ShoppingBag}
                    title="Product recommendations"
                    description="Suggest products based on customer conversations."
                  >
                    <Toggle
                      checked={
                        aiSettings.productRecommendations
                      }
                      onChange={(value) =>
                        updateAI(
                          "productRecommendations",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Users}
                    title="Customer memory"
                    description="Allow AI to use previous customer interactions when responding."
                  >
                    <Toggle
                      checked={
                        aiSettings.customerMemory
                      }
                      onChange={(value) =>
                        updateAI(
                          "customerMemory",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={UserRound}
                    title="Human handoff"
                    description="Allow customers to be transferred to a human."
                  >
                    <Toggle
                      checked={
                        aiSettings.humanHandoff
                      }
                      onChange={(value) =>
                        updateAI(
                          "humanHandoff",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={ShoppingBag}
                    title="Order assistance"
                    description="Allow AI to assist customers with product and order questions."
                  >
                    <Toggle
                      checked={
                        aiSettings.orderAssistance
                      }
                      onChange={(value) =>
                        updateAI(
                          "orderAssistance",
                          value
                        )
                      }
                    />
                  </SettingRow>
                </div>

                <Divider />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Response style"
                    description="Controls how the AI communicates."
                  >
                    <select
                      value={
                        aiSettings.responseStyle
                      }
                      onChange={(event) =>
                        updateAI(
                          "responseStyle",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option>
                        Professional
                      </option>
                      <option>
                        Friendly
                      </option>
                      <option>
                        Casual
                      </option>
                      <option>
                        Concise
                      </option>
                    </select>
                  </Field>

                  <Field
                    label="Confidence threshold"
                    description="Controls when AI should ask for human assistance."
                  >
                    <select
                      value={
                        aiSettings.confidenceThreshold
                      }
                      onChange={(event) =>
                        updateAI(
                          "confidenceThreshold",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </Field>
                </div>

                <InfoBox icon={Sparkles}>
                  Your AI should answer using your product
                  catalog and approved business knowledge.
                  When confidence is low, it should hand the
                  conversation to a human instead of guessing.
                </InfoBox>
              </SettingsSection>
            )}

            {/* =================================================
                CUSTOMER EXPERIENCE
            ================================================== */}

            {activeSection === "customer" && (
              <SettingsSection
                icon={MessageSquare}
                title="Customer Experience"
                description="Control what customers experience when they interact with your business."
              >
                <Field
                  label="Welcome message"
                  description="Shown when a customer starts a new conversation."
                >
                  <textarea
                    rows={3}
                    value={
                      customerSettings.welcomeMessage
                    }
                    onChange={(event) =>
                      updateCustomer(
                        "welcomeMessage",
                        event.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </Field>

                <Field
                  label="Order confirmation"
                  description="Message shown after an order is captured."
                >
                  <textarea
                    rows={3}
                    value={
                      customerSettings.orderConfirmation
                    }
                    onChange={(event) =>
                      updateCustomer(
                        "orderConfirmation",
                        event.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </Field>

                <Divider />

                <div className="space-y-2">
                  <SettingRow
                    icon={ShoppingBag}
                    title="Product recommendations"
                    description="Show relevant product suggestions to customers."
                  >
                    <Toggle
                      checked={
                        customerSettings.showProductRecommendations
                      }
                      onChange={(value) =>
                        updateCustomer(
                          "showProductRecommendations",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Package}
                    title="Show product availability"
                    description="Show customers whether products are in stock."
                  >
                    <Toggle
                      checked={
                        customerSettings.showAvailability
                      }
                      onChange={(value) =>
                        updateCustomer(
                          "showAvailability",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={MessageCircle}
                    title="Customer chat"
                    description="Allow customers to chat directly with your business."
                  >
                    <Toggle
                      checked={
                        customerSettings.allowCustomerChat
                      }
                      onChange={(value) =>
                        updateCustomer(
                          "allowCustomerChat",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Users}
                    title="Guest checkout"
                    description="Allow customers to place orders without creating an account."
                  >
                    <Toggle
                      checked={
                        customerSettings.allowGuestCheckout
                      }
                      onChange={(value) =>
                        updateCustomer(
                          "allowGuestCheckout",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Smartphone}
                    title="Collect phone number"
                    description="Ask customers for a phone number during checkout."
                  >
                    <Toggle
                      checked={
                        customerSettings.collectPhone
                      }
                      onChange={(value) =>
                        updateCustomer(
                          "collectPhone",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Mail}
                    title="Collect email"
                    description="Ask customers for an email address during checkout."
                  >
                    <Toggle
                      checked={
                        customerSettings.collectEmail
                      }
                      onChange={(value) =>
                        updateCustomer(
                          "collectEmail",
                          value
                        )
                      }
                    />
                  </SettingRow>
                </div>
              </SettingsSection>
            )}

            {/* =================================================
                NOTIFICATIONS
            ================================================== */}

            {activeSection ===
              "notifications" && (
              <SettingsSection
                icon={Bell}
                title="Notifications"
                description="Choose which events ThreadOS AI should notify you about."
              >
                <div className="space-y-2">
                  <SettingRow
                    icon={MessageSquare}
                    title="New conversation"
                    description="Notify me when a new customer starts a conversation."
                  >
                    <Toggle
                      checked={
                        notifications.newConversation
                      }
                      onChange={(value) =>
                        updateNotification(
                          "newConversation",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={UserRound}
                    title="Human handoff"
                    description="Notify me when a customer requests a human."
                  >
                    <Toggle
                      checked={
                        notifications.humanHandoff
                      }
                      onChange={(value) =>
                        updateNotification(
                          "humanHandoff",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={ShoppingBag}
                    title="New order"
                    description="Notify me when a new order is created."
                  >
                    <Toggle
                      checked={
                        notifications.newOrder
                      }
                      onChange={(value) =>
                        updateNotification(
                          "newOrder",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={AlertTriangleIcon}
                    title="Low stock"
                    description="Notify me when products reach low stock."
                  >
                    <Toggle
                      checked={
                        notifications.lowStock
                      }
                      onChange={(value) =>
                        updateNotification(
                          "lowStock",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={BarChartIcon}
                    title="Daily summary"
                    description="Receive a daily summary of your store activity."
                  >
                    <Toggle
                      checked={
                        notifications.dailySummary
                      }
                      onChange={(value) =>
                        updateNotification(
                          "dailySummary",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Mail}
                    title="Email notifications"
                    description="Receive important alerts by email."
                  >
                    <Toggle
                      checked={
                        notifications.emailNotifications
                      }
                      onChange={(value) =>
                        updateNotification(
                          "emailNotifications",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Bell}
                    title="Browser notifications"
                    description="Show notifications inside your browser."
                  >
                    <Toggle
                      checked={
                        notifications.browserNotifications
                      }
                      onChange={(value) =>
                        updateNotification(
                          "browserNotifications",
                          value
                        )
                      }
                    />
                  </SettingRow>
                </div>
              </SettingsSection>
            )}

            {/* =================================================
                CHANNELS
            ================================================== */}

            {activeSection === "channels" && (
              <SettingsSection
                icon={Globe}
                title="Channels"
                description="Control where customers can contact your business."
              >
                <ChannelCard
                  icon={MessageCircle}
                  iconClass="text-green-600"
                  bgClass="bg-green-50"
                  title="WhatsApp"
                  description="Receive customer messages from WhatsApp."
                  connected={
                    channels.whatsapp
                  }
                  onChange={(value) =>
                    updateChannel(
                      "whatsapp",
                      value
                    )
                  }
                />

                <ChannelCard
                  icon={Instagram}
                  iconClass="text-pink-600"
                  bgClass="bg-pink-50"
                  title="Instagram"
                  description="Connect Instagram conversations to your inbox."
                  connected={
                    channels.instagram
                  }
                  onChange={(value) =>
                    updateChannel(
                      "instagram",
                      value
                    )
                  }
                />

                <ChannelCard
                  icon={Facebook}
                  iconClass="text-blue-600"
                  bgClass="bg-blue-50"
                  title="Facebook"
                  description="Receive messages from Facebook customers."
                  connected={
                    channels.facebook
                  }
                  onChange={(value) =>
                    updateChannel(
                      "facebook",
                      value
                    )
                  }
                />

                <ChannelCard
                  icon={Globe}
                  iconClass="text-gray-600 dark:text-gray-300"
                  bgClass="bg-gray-100 dark:bg-gray-800"
                  title="Website"
                  description="Connect your public storefront chat to ThreadOS."
                  connected={
                    channels.website
                  }
                  onChange={(value) =>
                    updateChannel(
                      "website",
                      value
                    )
                  }
                />

                <InfoBox icon={Globe}>
                  Channel connections will eventually use
                  secure OAuth/API connections. The switches
                  above currently represent your channel
                  preferences.
                </InfoBox>
              </SettingsSection>
            )}

            {/* =================================================
                STOREFRONT
            ================================================== */}

            {activeSection ===
              "storefront" && (
              <SettingsSection
                icon={ShoppingBag}
                title="Storefront"
                description="Control the public shopping experience customers see."
              >
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-700">
                      <Eye
                        size={16}
                        className="text-gray-500 dark:text-gray-300"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold">
                        Public storefront
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-gray-500 dark:text-gray-400">
                        Customers can use your public
                        storefront to browse products,
                        chat with your business and place
                        orders.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Store name"
                    description="Name shown on your public storefront."
                  >
                    <input
                      type="text"
                      value={
                        storefront.storeName
                      }
                      onChange={(event) =>
                        updateStorefront(
                          "storeName",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Store visibility"
                    description="Make your storefront available to customers."
                  >
                    <div className="flex h-10 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-800">
                      <span className="text-xs">
                        {storefront.enabled
                          ? "Published"
                          : "Hidden"}
                      </span>

                      <Toggle
                        checked={
                          storefront.enabled
                        }
                        onChange={(value) =>
                          updateStorefront(
                            "enabled",
                            value
                          )
                        }
                      />
                    </div>
                  </Field>
                </div>

                <Field
                  label="Store description"
                  description="Short description displayed to customers."
                >
                  <textarea
                    rows={4}
                    value={
                      storefront.storeDescription
                    }
                    onChange={(event) =>
                      updateStorefront(
                        "storeDescription",
                        event.target.value
                      )
                    }
                    className={textareaClass}
                  />
                </Field>

                <Divider />

                <div className="space-y-2">
                  <SettingRow
                    icon={CircleDollarSignIcon}
                    title="Show prices"
                    description="Display product prices publicly."
                  >
                    <Toggle
                      checked={
                        storefront.showPrices
                      }
                      onChange={(value) =>
                        updateStorefront(
                          "showPrices",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Package}
                    title="Show stock"
                    description="Display product availability publicly."
                  >
                    <Toggle
                      checked={
                        storefront.showStock
                      }
                      onChange={(value) =>
                        updateStorefront(
                          "showStock",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={MessageCircle}
                    title="Customer chat"
                    description="Allow customers to chat from the storefront."
                  >
                    <Toggle
                      checked={
                        storefront.showCustomerChat
                      }
                      onChange={(value) =>
                        updateStorefront(
                          "showCustomerChat",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Bot}
                    title="AI assistant"
                    description="Show the AI chat assistant inside the storefront."
                  >
                    <Toggle
                      checked={
                        storefront.showAiAssistant
                      }
                      onChange={(value) =>
                        updateStorefront(
                          "showAiAssistant",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={ShoppingBag}
                    title="Allow ordering"
                    description="Allow customers to start orders from the storefront."
                  >
                    <Toggle
                      checked={
                        storefront.allowOrdering
                      }
                      onChange={(value) =>
                        updateStorefront(
                          "allowOrdering",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Eye}
                    title="Guest browsing"
                    description="Allow customers to browse without logging in."
                  >
                    <Toggle
                      checked={
                        storefront.allowGuestBrowsing
                      }
                      onChange={(value) =>
                        updateStorefront(
                          "allowGuestBrowsing",
                          value
                        )
                      }
                    />
                  </SettingRow>
                </div>
              </SettingsSection>
            )}

            {/* =================================================
                KNOWLEDGE BASE
            ================================================== */}

            {activeSection ===
              "knowledge" && (
              <SettingsSection
                icon={BookOpen}
                title="Knowledge Base"
                description="Control what information your AI is allowed to use."
              >
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-700">
                      <Database
                        size={16}
                        className="text-gray-500 dark:text-gray-300"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold">
                        AI knowledge sources
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-gray-500 dark:text-gray-400">
                        ThreadOS AI can use your products,
                        FAQs, policies and business information
                        when answering customers.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-dashed border-gray-300 p-4 text-left transition hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                      <Upload
                        size={17}
                        className="text-gray-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold">
                        Upload knowledge
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        Add FAQs, policies or business documents.
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-gray-400"
                  />
                </button>

                <Divider />

                <div className="space-y-2">
                  <SettingRow
                    icon={Package}
                    title="Product information"
                    description="Allow AI to use your product catalog."
                  >
                    <Toggle
                      checked={
                        knowledge.productInformation
                      }
                      onChange={(value) =>
                        updateKnowledge(
                          "productInformation",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={MessageSquare}
                    title="FAQs"
                    description="Use frequently asked questions when answering customers."
                  >
                    <Toggle
                      checked={knowledge.faq}
                      onChange={(value) =>
                        updateKnowledge(
                          "faq",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={ShoppingBag}
                    title="Delivery policy"
                    description="Allow AI to answer delivery questions."
                  >
                    <Toggle
                      checked={
                        knowledge.deliveryPolicy
                      }
                      onChange={(value) =>
                        updateKnowledge(
                          "deliveryPolicy",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={RotateCcw}
                    title="Return policy"
                    description="Allow AI to answer return and exchange questions."
                  >
                    <Toggle
                      checked={
                        knowledge.returnPolicy
                      }
                      onChange={(value) =>
                        updateKnowledge(
                          "returnPolicy",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={CircleDollarSignIcon}
                    title="Payment policy"
                    description="Allow AI to answer payment-related questions."
                  >
                    <Toggle
                      checked={
                        knowledge.paymentPolicy
                      }
                      onChange={(value) =>
                        updateKnowledge(
                          "paymentPolicy",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Store}
                    title="Business information"
                    description="Use your business information when answering customers."
                  >
                    <Toggle
                      checked={
                        knowledge.businessInformation
                      }
                      onChange={(value) =>
                        updateKnowledge(
                          "businessInformation",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={ShoppingBag}
                    title="Order information"
                    description="Allow AI to use order information where permitted."
                  >
                    <Toggle
                      checked={
                        knowledge.orderInformation
                      }
                      onChange={(value) =>
                        updateKnowledge(
                          "orderInformation",
                          value
                        )
                      }
                    />
                  </SettingRow>
                </div>

                <InfoBox icon={Info}>
                  Keep your product prices, stock and policies
                  up to date. This helps prevent the AI from
                  giving customers outdated information.
                </InfoBox>
              </SettingsSection>
            )}

            {/* =================================================
                TEAM
            ================================================== */}

            {activeSection === "team" && (
              <SettingsSection
                icon={Users}
                title="Team & Access"
                description="Manage who can access your business workspace."
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className={subHeadingClass}>
                      Team members
                    </h3>

                    <p className={descriptionClass}>
                      People who can access your seller dashboard.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">
                      Add member
                    </span>
                  </button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                  {teamMembers.map(
                    (member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 border-b border-gray-100 p-4 last:border-b-0 dark:border-gray-800"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                          {member.name
                            .split(" ")
                            .map(
                              (part) =>
                                part[0]
                            )
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold">
                            {member.name}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-gray-400">
                            {member.email}
                          </p>
                        </div>

                        <span className="hidden rounded-full bg-gray-100 px-2 py-1 text-[9px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:inline-flex">
                          {member.role}
                        </span>

                        {member.role !==
                          "Owner" && (
                          <button
                            type="button"
                            onClick={() =>
                              removeTeamMember(
                                member.id
                              )
                            }
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>

                <InfoBox>
                  Owners and authorized team members should
                  only receive the permissions they need.
                </InfoBox>
              </SettingsSection>
            )}

            {/* =================================================
                SECURITY
            ================================================== */}

            {activeSection ===
              "security" && (
              <SettingsSection
                icon={Shield}
                title="Security"
                description="Protect your ThreadOS account and seller workspace."
              >
                <div className="space-y-2">
                  <SettingRow
                    icon={Shield}
                    title="Two-factor authentication"
                    description="Add an extra verification step when signing in."
                  >
                    <Toggle
                      checked={
                        security.twoFactor
                      }
                      onChange={(value) =>
                        updateSecurity(
                          "twoFactor",
                          value
                        )
                      }
                    />
                  </SettingRow>

                  <SettingRow
                    icon={Bell}
                    title="Login alerts"
                    description="Notify me when a new device signs into the account."
                  >
                    <Toggle
                      checked={
                        security.loginAlerts
                      }
                      onChange={(value) =>
                        updateSecurity(
                          "loginAlerts",
                          value
                        )
                      }
                    />
                  </SettingRow>
                </div>

                <Divider />

                <Field
                  label="Session timeout"
                  description="Automatically sign out after inactivity."
                >
                  <select
                    value={
                      security.sessionTimeout
                    }
                    onChange={(event) =>
                      updateSecurity(
                        "sessionTimeout",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option>
                      15 minutes
                    </option>

                    <option>
                      30 minutes
                    </option>

                    <option>
                      1 hour
                    </option>

                    <option>
                      4 hours
                    </option>

                    <option>
                      Never
                    </option>
                  </select>
                </Field>

                <Divider />

                <div>
                  <h3 className={subHeadingClass}>
                    Account security
                  </h3>

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <Lock
                          size={17}
                          className="text-gray-400"
                        />

                        <div>
                          <p className="text-xs font-medium">
                            Change password
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            Update your account password.
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        size={15}
                        className="text-gray-400"
                      />
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone
                          size={17}
                          className="text-gray-400"
                        />

                        <div>
                          <p className="text-xs font-medium">
                            Active sessions
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            Review devices currently signed into your account.
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        size={15}
                        className="text-gray-400"
                      />
                    </button>
                  </div>
                </div>

                <Divider />

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                >
                  <LogOut size={15} />
                  Sign out of all sessions
                </button>
              </SettingsSection>
            )}
          </div>
        </main>
      </div>
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Change password</h2>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Current password</label>
                <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-300 dark:border-gray-700 dark:bg-gray-800" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">New password</label>
                <input type="password" value={passwordData.newPass} onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-300 dark:border-gray-700 dark:bg-gray-800" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Confirm new password</label>
                <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-300 dark:border-gray-700 dark:bg-gray-800" required />
              </div>
              {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs text-green-600">{passwordSuccess}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium dark:border-gray-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900">Update password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   SETTINGS SECTION
========================================================= */

const SettingsSection = ({
  icon: Icon,
  title,
  description,
  children,
}) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Icon
            size={18}
            className="text-gray-600 dark:text-gray-300"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {children}
      </div>
    </section>
  );
};

/* =========================================================
   FIELD
========================================================= */

const Field = ({
  label,
  description,
  children,
}) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {description && (
        <p className="mt-1 text-[10px] leading-4 text-gray-400">
          {description}
        </p>
      )}

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

/* =========================================================
   SETTING ROW
========================================================= */

const SettingRow = ({
  icon: Icon,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
        <Icon
          size={15}
          className="text-gray-500 dark:text-gray-300"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-gray-400">
          {description}
        </p>
      </div>

      <div className="shrink-0">
        {children}
      </div>
    </div>
  );
};

/* =========================================================
   TOGGLE
========================================================= */

const Toggle = ({
  checked,
  onChange,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative h-6 w-11 rounded-full
        transition
        ${
          checked
            ? "bg-gray-900 dark:bg-white"
            : "bg-gray-200 dark:bg-gray-700"
        }
      `}
    >
      <span
        className={`
          absolute top-1 h-4 w-4 rounded-full
          bg-white shadow-sm transition
          ${
            checked
              ? "left-6 dark:bg-gray-900"
              : "left-1"
          }
        `}
      />
    </button>
  );
};

/* =========================================================
   THEME CARD
========================================================= */

const ThemeCard = ({
  label,
  description,
  icon: Icon,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative rounded-2xl border p-4 text-left transition
        ${
          selected
            ? "border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800"
            : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        }
      `}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
          <Check size={12} />
        </div>
      )}

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
        <Icon
          size={17}
          className="text-gray-600 dark:text-gray-300"
        />
      </div>

      <p className="mt-4 text-xs font-semibold">
        {label}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-gray-400">
        {description}
      </p>
    </button>
  );
};

/* =========================================================
   CHANNEL CARD
========================================================= */

const ChannelCard = ({
  icon: Icon,
  iconClass,
  bgClass,
  title,
  description,
  connected,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgClass}`}
      >
        <Icon
          size={18}
          className={iconClass}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold">
            {title}
          </p>

          {connected && (
            <span className="rounded-full bg-green-50 px-2 py-1 text-[9px] font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
              Connected
            </span>
          )}
        </div>

        <p className="mt-1 text-[10px] leading-4 text-gray-400">
          {description}
        </p>
      </div>

      <Toggle
        checked={connected}
        onChange={onChange}
      />
    </div>
  );
};

/* =========================================================
   INFO BOX
========================================================= */

const InfoBox = ({
  icon: Icon = Info,
  children,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-start gap-3">
        <Icon
          size={15}
          className="mt-0.5 shrink-0 text-gray-400"
        />

        <p className="text-[10px] leading-5 text-gray-500 dark:text-gray-400">
          {children}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   DIVIDER
========================================================= */

const Divider = () => {
  return (
    <div className="h-px bg-gray-100 dark:bg-gray-800" />
  );
};

/* =========================================================
   COMMON CLASSES
========================================================= */

const inputClass = `
  h-10 w-full rounded-xl
  border border-gray-200
  bg-gray-50
  px-3
  text-sm text-gray-900
  outline-none
  transition
  placeholder:text-gray-400
  focus:border-gray-300
  focus:bg-white
  focus:ring-1
  focus:ring-gray-200
  dark:border-gray-700
  dark:bg-gray-800
  dark:text-gray-100
  dark:focus:border-gray-600
  dark:focus:bg-gray-800
`;

const textareaClass = `
  w-full rounded-xl
  border border-gray-200
  bg-gray-50
  px-3 py-3
  text-sm text-gray-900
  outline-none
  transition
  placeholder:text-gray-400
  focus:border-gray-300
  focus:bg-white
  focus:ring-1
  focus:ring-gray-200
  dark:border-gray-700
  dark:bg-gray-800
  dark:text-gray-100
  dark:focus:border-gray-600
`;

const subHeadingClass =
  "text-xs font-semibold text-gray-800 dark:text-gray-200";

const descriptionClass =
  "mt-1 text-[10px] leading-4 text-gray-400";

/* =========================================================
   ICON HELPERS
========================================================= */

const AlertTriangleIcon = ({
  size,
  className,
}) => (
  <AlertTriangle
    size={size}
    className={className}
  />
);

const BarChartIcon = ({
  size,
  className,
}) => (
  <BarChart3
    size={size}
    className={className}
  />
);

const CircleDollarSignIcon = ({
  size,
  className,
}) => (
  <CircleDollarSign
    size={size}
    className={className}
  />
);

/* =========================================================
   EXPORT
========================================================= */

export default Settings;