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
  History,
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
import { api } from "../service/api";
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

  const [aiSaving, setAiSaving] = useState(false);
  const [aiError, setAiError] = useState("");

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
    newConversation: null,
    humanHandoff: null,
    newOrder: null,
    lowStock: null,
    dailySummary: null,
    emailNotifications: null,
    browserNotifications: null,
  });
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  /* =======================================================
     CHANNELS
  ======================================================= */

  const [channels, setChannels] = useState({
    whatsapp: { enabled: false, status: "not_configured" },
    instagram: { enabled: false, status: "not_configured" },
    facebook: { enabled: false, status: "not_configured" },
    website: { enabled: false, status: "not_configured" },
    telegram: { enabled: false, status: "not_configured" },
  });
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [channelSaving, setChannelSaving] = useState(null);
  const [channelError, setChannelError] = useState("");
  
  // WhatsApp setup modal state
  const [showWhatsAppSetup, setShowWhatsAppSetup] = useState(false);
  const [whatsappCredentials, setWhatsappCredentials] = useState({
    access_token: "",
    phone_number_id: "",
    waba_id: "",
    app_id: "",
    app_secret: "",
    verify_token: "",
  });
  const [whatsappSetupLoading, setWhatsappSetupLoading] = useState(false);
  const [whatsappSetupError, setWhatsappSetupError] = useState("");
  const [whatsappWebhookUrl, setWhatsappWebhookUrl] = useState("");

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
    faqContent: "",
    deliveryPolicy: true,
    deliveryPolicyContent: "",
    returnPolicy: true,
    returnPolicyContent: "",
    paymentPolicy: true,
    paymentPolicyContent: "",
    businessInformation: true,
    businessInformationContent: "",
    orderInformation: true,
    orderInformationContent: "",
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

  // 2FA STATE
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStatus, setTwoFAStatus] = useState({ enabled: false, setupComplete: false });
  const [twoFASetup, setTwoFASetup] = useState(null); // { secret, qrCode, backupCodes, uri }
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAStep, setTwoFAStep] = useState("initial"); // initial, scan, verify, disable, backup
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFASuccess, setTwoFASuccess] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFADisableCode, setTwoFADisableCode] = useState("");

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

  // Fetch channel connections on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setChannelsLoading(true);
        const data = await api.channels.list();
        const channelsMap = {};
        data.forEach((ch) => {
          channelsMap[ch.type] = {
            enabled: ch.enabled,
            status: ch.status,
            displayName: ch.displayName || "",
            lastConnectedAt: ch.lastConnectedAt,
            lastMessageAt: ch.lastMessageAt,
          };
        });
        setChannels((prev) => ({ ...prev, ...channelsMap }));
      } catch (err) {
        console.error("Failed to fetch channels:", err);
      } finally {
        setChannelsLoading(false);
      }
    };
    fetchChannels();
  }, []);

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
     AI UPDATE (auto-save immediately)
  ======================================================= */

  const updateAI = async (field, value) => {
    // Optimistic update
    setAiSettings((current) => ({
      ...current,
      [field]: value,
    }));
    setAiError("");
    setAiSaving(true);
    try {
      await updateSettings({
        ai: { [field]: value },
      });
    } catch (err) {
      // Revert on error
      setAiSettings((current) => ({
        ...current,
        [field]: typeof value === "boolean" ? !value : current[field],
      }));
      setAiError(err.message || "Failed to save AI setting");
    } finally {
      setAiSaving(false);
    }
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
     NOTIFICATION UPDATE (auto-save immediately)
  ======================================================= */

  const updateNotification = async (field, value) => {
    // Optimistic update
    setNotifications((current) => ({
      ...current,
      [field]: value,
    }));
    setNotificationError("");
    setNotificationSaving(true);
    try {
      await updateSettings({
        notifications: { [field]: value },
      });
    } catch (err) {
      // Revert on error
      setNotifications((current) => ({
        ...current,
        [field]: !value,
      }));
      setNotificationError(err.message || "Failed to save notification setting");
    } finally {
      setNotificationSaving(false);
    }
  };

  /* =======================================================
     CHANNEL UPDATE (connect/disconnect)
  ======================================================= */

  const updateChannel = async (channelType, enabled) => {
    setChannelError("");
    
    // WhatsApp requires special setup flow
    if (channelType === "whatsapp" && enabled) {
      setShowWhatsAppSetup(true);
      return;
    }
    
    setChannelSaving(channelType);
    try {
      if (enabled) {
        // Create or update channel, then connect
        await api.channels.create({ type: channelType, enabled: true });
        const connected = await api.channels.connect(channelType);
        setChannels((prev) => ({
          ...prev,
          [channelType]: {
            enabled: connected.enabled,
            status: connected.status,
            displayName: connected.displayName || "",
            lastConnectedAt: connected.lastConnectedAt,
          },
        }));
      } else {
        // Disconnect channel
        if (channelType === "whatsapp") {
          await api.channels.whatsapp.disconnect();
        } else {
          await api.channels.disconnect(channelType);
        }
        setChannels((prev) => ({
          ...prev,
          [channelType]: {
            enabled: false,
            status: "disconnected",
            displayName: prev[channelType]?.displayName || "",
          },
        }));
      }
    } catch (err) {
      setChannelError(err.message || `Failed to update ${channelType} channel`);
      console.error(`Failed to update ${channelType} channel:`, err);
    } finally {
      setChannelSaving(null);
    }
  };

  const handleWhatsAppSetup = async () => {
    setWhatsappSetupError("");
    setWhatsappSetupLoading(true);
    try {
      // Validate required fields
      const required = ["access_token", "phone_number_id", "waba_id", "app_secret", "verify_token"];
      const missing = required.filter((f) => !whatsappCredentials[f]?.trim());
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
      }
      
      const result = await api.channels.whatsapp.setup(whatsappCredentials);
      setChannels((prev) => ({
        ...prev,
        whatsapp: {
          enabled: result.channel.enabled,
          status: result.channel.status,
          displayName: result.channel.displayName || "",
          lastConnectedAt: result.channel.lastConnectedAt,
        },
      }));
      setWhatsappWebhookUrl(result.webhook_url || "");
      setShowWhatsAppSetup(false);
      setWhatsappCredentials({
        access_token: "",
        phone_number_id: "",
        waba_id: "",
        app_id: "",
        app_secret: "",
        verify_token: "",
      });
    } catch (err) {
      setWhatsappSetupError(err.message || "Failed to setup WhatsApp");
    } finally {
      setWhatsappSetupLoading(false);
    }
  };

  /* =======================================================
     STOREFRONT UPDATE
======================================================= */

  const [storefrontSaving, setStorefrontSaving] = useState(false);
  const [storefrontError, setStorefrontError] = useState("");

  const updateStorefront = async (field, value) => {
    // Optimistic update
    setStorefront((current) => ({
      ...current,
      [field]: value,
    }));
    setStorefrontError("");
    setStorefrontSaving(true);
    try {
      await updateSettings({
        storefront: { [field]: value },
      });
    } catch (err) {
      // Revert on error
      setStorefront((current) => ({
        ...current,
        [field]: !value,
      }));
      setStorefrontError(err.message || "Failed to save storefront setting");
    } finally {
      setStorefrontSaving(false);
    }
  };

  /* =======================================================
     KNOWLEDGE UPDATE
  ======================================================= */

  const [knowledgeSaving, setKnowledgeSaving] = useState(false);
  const [knowledgeError, setKnowledgeError] = useState("");

  const updateKnowledge = async (field, value) => {
    // Optimistic update
    setKnowledge((current) => ({
      ...current,
      [field]: value,
    }));
    setKnowledgeError("");
    setKnowledgeSaving(true);
    try {
      await updateSettings({
        knowledge: { [field]: value },
      });
    } catch (err) {
      // Revert on error
      setKnowledge((current) => ({
        ...current,
        [field]: typeof value === "boolean" ? !value : current[field],
      }));
      setKnowledgeError(err.message || "Failed to save knowledge setting");
    } finally {
      setKnowledgeSaving(false);
    }
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

  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState("");
  const [teamSuccess, setTeamSuccess] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "Agent" });
  const [editForm, setEditForm] = useState({ role: "Agent", permissions: {} });

  // SESSIONS STATE
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState("");
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  // Load team members from API
  const fetchTeamMembers = async () => {
    setTeamLoading(true);
    try {
      const data = await api.team.list();
      setTeamMembers(data);
    } catch (err) {
      setTeamError(err.message || "Failed to load team members");
    } finally {
      setTeamLoading(false);
    }
  };

  // Add team member
  const handleAddTeamMember = async () => {
    if (!inviteForm.email.trim() || !inviteForm.name.trim()) {
      setTeamError("Name and email are required");
      return;
    }
    setTeamError("");
    setTeamSuccess("");
    try {
      const newMember = await api.team.add({
        name: inviteForm.name.trim(),
        email: inviteForm.email.trim(),
        role: inviteForm.role,
      });
      setTeamMembers((prev) => [...prev, newMember]);
      setShowInviteModal(false);
      setInviteForm({ name: "", email: "", role: "Agent" });
      setTeamSuccess("Team member invited successfully");
      setTimeout(() => setTeamSuccess(""), 3000);
    } catch (err) {
      setTeamError(err.message || "Failed to add team member");
    }
  };

  // Update team member
  const handleUpdateMember = async () => {
    if (!editingMember) return;
    setTeamError("");
    setTeamSuccess("");
    try {
      const updated = await api.team.update(editingMember.id, {
        role: editForm.role,
        permissions: editForm.permissions,
      });
      setTeamMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setShowEditModal(false);
      setEditingMember(null);
      setTeamSuccess("Team member updated");
      setTimeout(() => setTeamSuccess(""), 3000);
    } catch (err) {
      setTeamError(err.message || "Failed to update team member");
    }
  };

  // Remove team member
  const removeTeamMember = async (id) => {
    const confirmed = window.confirm("Remove this team member?");
    if (!confirmed) return;
    setTeamError("");
    setTeamSuccess("");
    try {
      await api.team.remove(id);
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      setTeamSuccess("Team member removed");
      setTimeout(() => setTeamSuccess(""), 3000);
    } catch (err) {
      setTeamError(err.message || "Failed to remove team member");
    }
  };

  // Open edit modal
  const openEditModal = (member) => {
    setEditingMember(member);
    setEditForm({
      role: member.role,
      permissions: { ...member.permissions },
    });
    setShowEditModal(true);
  };

  // Load team on mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  /* =======================================================
     SESSIONS
  ======================================================= */

  const fetchSessions = async () => {
    setSessionsLoading(true);
    setSessionsError("");
    try {
      const data = await api.sessions.list();
      setSessions(data);
    } catch (err) {
      setSessionsError(err.message || "Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    setSessionsError("");
    try {
      await api.sessions.revoke(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      setSessionsError(err.message || "Failed to revoke session");
    }
  };

  const handleRevokeAllSessions = async () => {
    setSessionsError("");
    try {
      await api.sessions.revokeAll();
      fetchSessions(); // Refresh list
    } catch (err) {
      setSessionsError(err.message || "Failed to revoke sessions");
    }
  };

  const openSessionsModal = () => {
    fetchSessions();
    setShowSessionsModal(true);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "Unknown";
    const date = new Date(ts * 1000);
    return date.toLocaleString();
  };

  /* =======================================================
     LOGIN HISTORY & SECURITY
  ======================================================= */

  const [loginHistory, setLoginHistory] = useState([]);
  const [knownDevices, setKnownDevices] = useState([]);
  const [loginHistoryLoading, setLoginHistoryLoading] = useState(false);
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);

  const fetchLoginHistory = async () => {
    setLoginHistoryLoading(true);
    try {
      const history = await api.security.loginHistory(50);
      setLoginHistory(history);
    } catch (err) {
      console.warn("Failed to fetch login history:", err);
    } finally {
      setLoginHistoryLoading(false);
    }
  };

  const fetchKnownDevices = async () => {
    try {
      const devices = await api.security.knownDevices();
      setKnownDevices(devices);
    } catch (err) {
      console.warn("Failed to fetch known devices:", err);
    }
  };

  const openLoginHistoryModal = () => {
    fetchLoginHistory();
    fetchKnownDevices();
    setShowLoginHistoryModal(true);
  };

  const closeLoginHistoryModal = () => {
    setShowLoginHistoryModal(false);
  };

  /* =======================================================
     TWO-FACTOR AUTHENTICATION
  ======================================================= */

  const fetch2FAStatus = async () => {
    try {
      const status = await api.twoFactor.status();
      setTwoFAStatus(status);
      setSecurity((c) => ({ ...c, twoFactor: status.enabled }));
    } catch (err) {
      console.warn("Failed to fetch 2FA status:", err);
    }
  };

  const handle2FASetup = async () => {
    setTwoFAError("");
    setTwoFASuccess("");
    setTwoFALoading(true);
    try {
      const setupData = await api.twoFactor.setup();
      setTwoFASetup(setupData);
      setTwoFAStep("scan");
    } catch (err) {
      setTwoFAError(err.message || "Failed to set up 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handle2FAVerify = async () => {
    if (!twoFACode.trim()) {
      setTwoFAError("Please enter the verification code");
      return;
    }
    setTwoFAError("");
    setTwoFASuccess("");
    setTwoFALoading(true);
    try {
      await api.twoFactor.confirm(twoFACode.trim());
      setTwoFASuccess("2FA enabled successfully!");
      setTwoFAStep("success");
      fetch2FAStatus();
      setTimeout(() => {
        setShow2FAModal(false);
        setTwoFAStep("initial");
        setTwoFACode("");
        setTwoFASetup(null);
      }, 2000);
    } catch (err) {
      setTwoFAError(err.message || "Invalid verification code");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handle2FADisable = async () => {
    if (!twoFADisableCode.trim()) {
      setTwoFAError("Please enter your 2FA code to disable");
      return;
    }
    setTwoFAError("");
    setTwoFASuccess("");
    setTwoFALoading(true);
    try {
      await api.twoFactor.disable(twoFADisableCode.trim());
      setTwoFASuccess("2FA disabled successfully");
      setTwoFAStep("initial");
      fetch2FAStatus();
      setTimeout(() => {
        setShow2FAModal(false);
        setTwoFADisableCode("");
      }, 2000);
    } catch (err) {
      setTwoFAError(err.message || "Invalid code");
    } finally {
      setTwoFALoading(false);
    }
  };

  const open2FAModal = async () => {
    await fetch2FAStatus();
    setShow2FAModal(true);
    setTwoFAStep("initial");
    setTwoFACode("");
    setTwoFADisableCode("");
    setTwoFAError("");
    setTwoFASuccess("");
  };

  const close2FAModal = () => {
    setShow2FAModal(false);
    setTwoFAStep("initial");
    setTwoFACode("");
    setTwoFADisableCode("");
    setTwoFAError("");
    setTwoFASuccess("");
    setTwoFASetup(null);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  if (loading) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-gradient-to-br from-violet-50 via-fuchsia-50 to-sky-50 dark:from-slate-950 dark:via-violet-950/30 dark:to-slate-950">
        <div className="text-center">
          <Loader2 size={28} className="mx-auto animate-spin text-text-tertiary" />
          <p className="mt-3 text-sm text-text-tertiary">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-gradient-to-br from-rose-50 via-violet-50 to-sky-50 p-6 dark:from-slate-950 dark:via-violet-950/30 dark:to-slate-950">
        <div className="max-w-sm text-center">
          <AlertTriangle size={28} className="mx-auto text-error" />
          <h3 className="mt-3 text-sm font-semibold text-text-primary dark:text-text-primary-dark">Failed to load settings</h3>
          <p className="mt-1 text-xs text-text-tertiary">{error}</p>
          <button onClick={refetch} className="mt-3 text-xs font-medium text-primary hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50 text-gray-900 dark:from-slate-950 dark:via-violet-950/20 dark:to-slate-950 dark:text-white">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <header className="flex shrink-0 items-center justify-between border-b border-violet-100 bg-white/90 px-4 py-4 shadow-sm backdrop-blur dark:border-violet-900/40 dark:bg-slate-900/90 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
              <SettingsIcon
                size={19}
                strokeWidth={1.8}
                className="text-white"
              />
            </div>

            <h1 className="truncate text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              Settings
            </h1>
          </div>

          <p className="mt-1 text-xs text-violet-600/80 dark:text-violet-300/70">
            Control your ThreadOS AI business experience.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="hidden items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200 dark:hover:bg-violet-900/50 sm:flex"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="shrink-0 border-b border-rose-100 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-2 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:from-rose-950/30 dark:to-orange-950/20 dark:text-rose-300">
          {saveError}
        </div>
      )}

      {/* =====================================================
          MOBILE SECTION BUTTON
      ====================================================== */}

      <div className="shrink-0 border-b border-violet-100 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-violet-900/40 dark:bg-slate-900/80 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (value) => !value
            )
          }
          className="flex w-full items-center justify-between rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-3 py-3 text-left shadow-sm dark:border-violet-800 dark:from-violet-950/40 dark:to-fuchsia-950/30"
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 dark:from-violet-900/50 dark:to-fuchsia-900/40 dark:text-violet-300">
                      <Icon size={15} />
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold">
                      {current?.label}
                    </p>

                    <p className="mt-0.5 text-[10px] text-violet-500/70 dark:text-violet-300/60">
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
          <div className="mt-2 overflow-hidden rounded-xl border border-violet-200 bg-white/80 shadow-lg shadow-violet-500/5 dark:border-violet-800 dark:bg-slate-900/80">
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
                        ? "bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/30"
                        : "hover:bg-violet-50 dark:hover:bg-violet-950/30"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        active
                          ? "text-violet-700 dark:text-violet-300"
                          : "text-gray-400 dark:text-gray-500"
                      }
                    />

                    <div>
                      <p className="text-xs font-medium">
                        {section.label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-violet-500/70 dark:text-violet-300/60">
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

        <aside className="hidden h-full w-[260px] shrink-0 overflow-y-auto border-r border-violet-100 bg-white/85 shadow-sm backdrop-blur dark:border-violet-900/40 dark:bg-slate-900/85 lg:block">
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
                        ? "bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/30"
                        : "hover:bg-violet-50 dark:hover:bg-violet-950/30"
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
                            ? "text-violet-900"
                            : "text-violet-500 dark:text-violet-300"
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

                      <p className="mt-0.5 truncate text-[10px] text-violet-500/70 dark:text-violet-300/60">
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
          <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-6">
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
                {aiError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                    {aiError}
                  </div>
                )}

                {aiSaving && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-text-tertiary">
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </div>
                )}

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
                {notificationError && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                    {notificationError}
                  </div>
                )}

                {notificationSaving && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </div>
                )}

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
                      onChange={async (value) => {
                        if (value && "Notification" in window) {
                          const permission = await Notification.requestPermission();
                          if (permission === "denied") {
                            setNotificationError("Browser notification permission was denied. Please enable it in your browser settings.");
                            return;
                          }
                        }
                        updateNotification("browserNotifications", value);
                      }}
                    />
                  </SettingRow>
                </div>
              </SettingsSection>
            )}

            {/* =================================================
                CHANNELS
            ================================================== */}

            {/* =================================================
    CHANNELS
================================================== */}

{activeSection === "channels" && (
  <SettingsSection
    icon={Globe}
    title="Channels"
    description="Control where customers can contact your business."
  >
    {/* Channel error */}
    {channelError && (
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm dark:border-red-900/50 dark:from-red-950/30 dark:to-rose-950/20">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
          <AlertTriangle size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-red-800 dark:text-red-300">
            Channel error
          </p>
          <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
            {channelError}
          </p>
        </div>
      </div>
    )}

    {channelsLoading ? (
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 py-12 dark:border-violet-900/30 dark:from-violet-950/20 dark:via-gray-900 dark:to-fuchsia-950/20">
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
            <Loader2
              size={22}
              className="animate-spin text-white"
            />
          </div>

          <p className="mt-4 text-xs font-semibold text-gray-700 dark:text-gray-200">
            Loading channels
          </p>

          <p className="mt-1 text-[11px] text-gray-400">
            Checking your connected customer channels...
          </p>
        </div>
      </div>
    ) : (
      <div className="space-y-4">

        {/* CHANNEL OVERVIEW */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-5 text-white shadow-lg shadow-violet-500/10 dark:border-violet-800">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 left-20 h-32 w-32 rounded-full bg-pink-400/20 blur-3xl" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <Share2 size={22} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold">
                  Omnichannel customer experience
                </h3>

                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">
                  ThreadOS
                </span>
              </div>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-violet-100">
                Bring conversations from WhatsApp, Instagram, Facebook,
                your website, and Telegram into one unified inbox.
              </p>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm ring-1 ring-white/10">
              <p className="text-[9px] uppercase tracking-wider text-violet-200">
                Channels
              </p>
              <p className="mt-0.5 text-sm font-bold">
                5
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm ring-1 ring-white/10">
              <p className="text-[9px] uppercase tracking-wider text-violet-200">
                Inbox
              </p>
              <p className="mt-0.5 text-sm font-bold">
                Unified
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm ring-1 ring-white/10">
              <p className="text-[9px] uppercase tracking-wider text-violet-200">
                AI
              </p>
              <p className="mt-0.5 text-sm font-bold">
                Ready
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm ring-1 ring-white/10">
              <p className="text-[9px] uppercase tracking-wider text-violet-200">
                Automation
              </p>
              <p className="mt-0.5 text-sm font-bold">
                Active
              </p>
            </div>
          </div>
        </div>

        {/* WHATSAPP */}
        <ChannelCard
          icon={MessageCircle}
          iconClass="text-green-600 dark:text-green-400"
          bgClass="bg-green-100 dark:bg-green-900/30"
          title="WhatsApp"
          description="Receive customer messages from WhatsApp."
          channelType="whatsapp"
          status={channels.whatsapp?.status || "not_configured"}
          enabled={channels.whatsapp?.enabled || false}
          saving={channelSaving === "whatsapp"}
          onChange={(value) => updateChannel("whatsapp", value)}
        />

        {/* INSTAGRAM */}
        <ChannelCard
          icon={Instagram}
          iconClass="text-pink-600 dark:text-pink-400"
          bgClass="bg-gradient-to-br from-pink-100 via-fuchsia-100 to-orange-100 dark:from-pink-900/30 dark:via-fuchsia-900/30 dark:to-orange-900/20"
          title="Instagram"
          description="Connect Instagram conversations to your inbox."
          channelType="instagram"
          status={channels.instagram?.status || "not_configured"}
          enabled={channels.instagram?.enabled || false}
          saving={channelSaving === "instagram"}
          onChange={(value) => updateChannel("instagram", value)}
        />

        {/* FACEBOOK */}
        <ChannelCard
          icon={Facebook}
          iconClass="text-blue-600 dark:text-blue-400"
          bgClass="bg-blue-100 dark:bg-blue-900/30"
          title="Facebook"
          description="Receive messages from Facebook customers."
          channelType="facebook"
          status={channels.facebook?.status || "not_configured"}
          enabled={channels.facebook?.enabled || false}
          saving={channelSaving === "facebook"}
          onChange={(value) => updateChannel("facebook", value)}
        />

        {/* WEBSITE */}
        <ChannelCard
          icon={Globe}
          iconClass="text-cyan-600 dark:text-cyan-400"
          bgClass="bg-cyan-100 dark:bg-cyan-900/30"
          title="Website"
          description="Connect your public storefront chat to ThreadOS."
          channelType="website"
          status={channels.website?.status || "not_configured"}
          enabled={channels.website?.enabled || false}
          saving={channelSaving === "website"}
          onChange={(value) => updateChannel("website", value)}
        />

        {/* TELEGRAM */}
        <ChannelCard
          icon={Bot}
          iconClass="text-sky-600 dark:text-sky-400"
          bgClass="bg-sky-100 dark:bg-sky-900/30"
          title="Telegram"
          description="Connect Telegram Bot to receive messages from customers."
          channelType="telegram"
          status={channels.telegram?.status || "not_configured"}
          enabled={channels.telegram?.enabled || false}
          saving={channelSaving === "telegram"}
          onChange={(value) => updateChannel("telegram", value)}
        />

        {/* CONNECTION GUIDE */}
        <div className="mt-5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 dark:border-amber-900/40 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-yellow-950/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <Info size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                Connecting your channels
              </p>

              <p className="mt-1 text-[11px] leading-5 text-amber-700 dark:text-amber-400">
                Toggle a channel on to connect it. Website uses ThreadOS
                chat directly. WhatsApp, Instagram, Facebook, and Telegram
                require API credentials which will be configured during
                the connection flow.
              </p>
            </div>
          </div>
        </div>

        <InfoBox icon={Info}>
          Your connected channels feed into the same ThreadOS inbox, allowing
          your team and AI assistant to manage conversations from one place.
        </InfoBox>
      </div>
    )}
  </SettingsSection>
)}

{/* =================================================
    WHATSAPP SETUP MODAL
================================================== */}

{showWhatsAppSetup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-green-200/70 bg-white shadow-2xl shadow-green-900/10 dark:border-green-900/40 dark:bg-gray-900">

      {/* MODAL HEADER */}
      <div className="relative shrink-0 overflow-hidden border-b border-green-100 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-5 py-5 dark:border-green-900/30 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/20">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-400/10 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20">
              <MessageCircle size={21} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Connect WhatsApp Business
                </h2>

                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  WhatsApp
                </span>
              </div>

              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                Enter your Meta Business API credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWhatsAppSetup(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close WhatsApp setup"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* MODAL FORM */}
      <div className="flex-1 overflow-y-auto px-5 py-5">

        {whatsappSetupError && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 dark:border-red-900/40 dark:from-red-950/30 dark:to-rose-950/20">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
              <AlertTriangle size={15} />
            </div>

            <div>
              <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                Connection failed
              </p>

              <p className="mt-1 text-[11px] leading-5 text-red-600 dark:text-red-400">
                {whatsappSetupError}
              </p>
            </div>
          </div>
        )}

        {/* SECURITY NOTICE */}
        <div className="mb-5 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 dark:border-violet-900/40 dark:from-violet-950/20 dark:to-fuchsia-950/20">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
              <Shield size={15} />
            </div>

            <div>
              <p className="text-xs font-semibold text-violet-900 dark:text-violet-300">
                Secure connection
              </p>

              <p className="mt-1 text-[10px] leading-5 text-violet-700 dark:text-violet-400">
                Your Meta credentials are used to establish the WhatsApp
                Business connection with ThreadOS.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">

          {/* ACCESS TOKEN */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Access Token *
            </label>

            <input
              type="password"
              value={whatsappCredentials.access_token}
              onChange={(e) =>
                setWhatsappCredentials({
                  ...whatsappCredentials,
                  access_token: e.target.value,
                })
              }
              placeholder="Meta long-lived access token"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-green-200 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-green-800 dark:focus:border-green-500 dark:focus:bg-gray-800"
            />
          </div>

          {/* PHONE NUMBER ID */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Phone Number ID *
            </label>

            <input
              type="text"
              value={whatsappCredentials.phone_number_id}
              onChange={(e) =>
                setWhatsappCredentials({
                  ...whatsappCredentials,
                  phone_number_id: e.target.value,
                })
              }
              placeholder="WhatsApp Business phone number ID"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-green-200 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-green-800 dark:focus:border-green-500 dark:focus:bg-gray-800"
            />
          </div>

          {/* WABA ID */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              WhatsApp Business Account ID (WABA) *
            </label>

            <input
              type="text"
              value={whatsappCredentials.waba_id}
              onChange={(e) =>
                setWhatsappCredentials({
                  ...whatsappCredentials,
                  waba_id: e.target.value,
                })
              }
              placeholder="WhatsApp Business Account ID"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-green-200 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-green-800 dark:focus:border-green-500 dark:focus:bg-gray-800"
            />
          </div>

          {/* APP ID */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Meta App ID
            </label>

            <input
              type="text"
              value={whatsappCredentials.app_id}
              onChange={(e) =>
                setWhatsappCredentials({
                  ...whatsappCredentials,
                  app_id: e.target.value,
                })
              }
              placeholder="Meta app ID (optional)"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-blue-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-blue-800 dark:focus:border-blue-500 dark:focus:bg-gray-800"
            />
          </div>

          {/* APP SECRET */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Meta App Secret *
            </label>

            <input
              type="password"
              value={whatsappCredentials.app_secret}
              onChange={(e) =>
                setWhatsappCredentials({
                  ...whatsappCredentials,
                  app_secret: e.target.value,
                })
              }
              placeholder="Meta app secret"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-violet-800 dark:focus:border-violet-500 dark:focus:bg-gray-800"
            />
          </div>

          {/* VERIFY TOKEN */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Webhook Verify Token *
            </label>

            <input
              type="text"
              value={whatsappCredentials.verify_token}
              onChange={(e) =>
                setWhatsappCredentials({
                  ...whatsappCredentials,
                  verify_token: e.target.value,
                })
              }
              placeholder="Your custom verify token"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-orange-200 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:hover:border-orange-800 dark:focus:border-orange-500 dark:focus:bg-gray-800"
            />

            <p className="mt-1.5 text-[10px] leading-4 text-gray-400">
              Create a secure token in Meta Business Suite webhook settings.
            </p>
          </div>
        </div>

        {/* WEBHOOK URL */}
        {whatsappWebhookUrl && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-green-950/20">
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Globe size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Webhook URL
                </p>

                <p className="mt-0.5 text-[10px] text-emerald-700 dark:text-emerald-400">
                  Configure this URL in Meta Business Suite.
                </p>

                <div className="mt-2 overflow-x-auto rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 dark:border-emerald-900/40 dark:bg-gray-900/50">
                  <p className="break-all font-mono text-[10px] leading-4 text-emerald-700 dark:text-emerald-300">
                    {whatsappWebhookUrl}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL FOOTER */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/80 px-5 py-4 dark:border-gray-800 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => setShowWhatsAppSetup(false)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleWhatsAppSetup}
          disabled={whatsappSetupLoading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-green-500/20 transition hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {whatsappSetupLoading ? (
            <>
              <Loader2
                size={14}
                className="animate-spin"
              />
              Connecting...
            </>
          ) : (
            <>
              <MessageCircle size={14} />
              Connect WhatsApp
            </>
          )}
        </button>
      </div>
    </div>
  </div>
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
                {storefrontError && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {storefrontError}
                  </div>
                )}
                {storefrontSaving && (
                  <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    Saving...
                  </div>
                )}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-700">
                      <Eye
                        size={16}
                        className="text-violet-600 dark:text-violet-300"
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
                {knowledgeError && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {knowledgeError}
                  </div>
                )}
                {knowledgeSaving && (
                  <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    Saving...
                  </div>
                )}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-700">
                      <Database
                        size={16}
                        className="text-violet-600 dark:text-violet-300"
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

                  {knowledge.faq && (
                    <div className="ml-10">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        FAQ Content
                      </label>
                      <textarea
                        rows={4}
                        value={knowledge.faqContent}
                        onChange={(e) =>
                          updateKnowledge("faqContent", e.target.value)
                        }
                        placeholder="Enter your FAQs here...&#10;Q: What are your operating hours?&#10;A: We are open Monday-Saturday, 9am-6pm.&#10;Q: Do you offer delivery?&#10;A: Yes, we deliver within Accra."
                        className={textareaClass}
                      />
                    </div>
                  )}

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

                  {knowledge.deliveryPolicy && (
                    <div className="ml-10">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Delivery Policy Content
                      </label>
                      <textarea
                        rows={3}
                        value={knowledge.deliveryPolicyContent}
                        onChange={(e) =>
                          updateKnowledge("deliveryPolicyContent", e.target.value)
                        }
                        placeholder="Enter your delivery policy...&#10;We offer same-day delivery in Accra and 1-2 day delivery nationwide."
                        className={textareaClass}
                      />
                    </div>
                  )}

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

                  {knowledge.returnPolicy && (
                    <div className="ml-10">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Return Policy Content
                      </label>
                      <textarea
                        rows={3}
                        value={knowledge.returnPolicyContent}
                        onChange={(e) =>
                          updateKnowledge("returnPolicyContent", e.target.value)
                        }
                        placeholder="Enter your return policy...&#10;Returns accepted within 14 days with receipt."
                        className={textareaClass}
                      />
                    </div>
                  )}

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

                  {knowledge.paymentPolicy && (
                    <div className="ml-10">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Payment Policy Content
                      </label>
                      <textarea
                        rows={3}
                        value={knowledge.paymentPolicyContent}
                        onChange={(e) =>
                          updateKnowledge("paymentPolicyContent", e.target.value)
                        }
                        placeholder="Enter your payment policy...&#10;We accept Mobile Money, bank transfer, and cash on delivery."
                        className={textareaClass}
                      />
                    </div>
                  )}

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

                  {knowledge.businessInformation && (
                    <div className="ml-10">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Business Information Content
                      </label>
                      <textarea
                        rows={3}
                        value={knowledge.businessInformationContent}
                        onChange={(e) =>
                          updateKnowledge("businessInformationContent", e.target.value)
                        }
                        placeholder="Enter additional business information...&#10;We are a family-owned fashion business since 2020."
                        className={textareaClass}
                      />
                    </div>
                  )}

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

                  {knowledge.orderInformation && (
                    <div className="ml-10">
                      <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Order Information Content
                      </label>
                      <textarea
                        rows={3}
                        value={knowledge.orderInformationContent}
                        onChange={(e) =>
                          updateKnowledge("orderInformationContent", e.target.value)
                        }
                        placeholder="Enter order-related information...&#10;Order tracking is available via SMS."
                        className={textareaClass}
                      />
                    </div>
                  )}
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
                {teamError && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {teamError}
                  </div>
                )}
                {teamSuccess && (
                  <div className="rounded-lg bg-green-50 p-3 text-xs text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    {teamSuccess}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className={subHeadingClass}>Team members</h3>
                    <p className={descriptionClass}>
                      People who can access your seller dashboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(true)}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Invite member</span>
                  </button>
                </div>

                {teamLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="py-8 text-center">
                    <Users className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No team members yet
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Invite people to help manage your store
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 border-b border-gray-100 p-4 last:border-b-0 dark:border-gray-800"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-semibold">
                              {member.name}
                            </p>
                            {member.status === "Pending" && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-700">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[10px] text-violet-500/70 dark:text-violet-300/60">
                            {member.email}
                          </p>
                        </div>

                        <span className="hidden rounded-full bg-gray-100 px-2 py-1 text-[9px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:inline-flex">
                          {member.role}
                        </span>

                        {member.role !== "Owner" && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(member)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeTeamMember(member.id)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <InfoBox>
                  Owners and authorized team members should only
                  receive the permissions they need.
                </InfoBox>

                {/* Invite Modal */}
                {showInviteModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Invite Team Member
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Send an invitation to join your workspace.
                      </p>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Name
                          </label>
                          <input
                            type="text"
                            value={inviteForm.name}
                            onChange={(e) =>
                              setInviteForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="John Doe"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Email
                          </label>
                          <input
                            type="email"
                            value={inviteForm.email}
                            onChange={(e) =>
                              setInviteForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="john@example.com"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Role
                          </label>
                          <select
                            value={inviteForm.role}
                            onChange={(e) =>
                              setInviteForm((prev) => ({
                                ...prev,
                                role: e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option value="Agent">Agent</option>
                            <option value="Admin">Admin</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowInviteModal(false);
                            setInviteForm({ name: "", email: "", role: "Agent" });
                          }}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddTeamMember}
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                        >
                          Send Invite
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Modal */}
                {showEditModal && editingMember && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Team Member
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {editingMember.name} ({editingMember.email})
                      </p>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Role
                          </label>
                          <select
                            value={editForm.role}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                role: e.target.value,
                              }))
                            }
                            className={inputClass}
                          >
                            <option value="Admin">Admin</option>
                            <option value="Agent">Agent</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                            Permissions
                          </label>
                          <div className="space-y-2">
                            {[
                              { key: "canManageProducts", label: "Manage products" },
                              { key: "canManageOrders", label: "Manage orders" },
                              { key: "canManageCustomers", label: "Manage customers" },
                              { key: "canManageConversations", label: "Manage conversations" },
                              { key: "canManageSettings", label: "Manage settings" },
                              { key: "canManageTeam", label: "Manage team" },
                              { key: "canViewAnalytics", label: "View analytics" },
                            ].map((perm) => (
                              <label
                                key={perm.key}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    editForm.permissions[perm.key] || false
                                  }
                                  onChange={(e) =>
                                    setEditForm((prev) => ({
                                      ...prev,
                                      permissions: {
                                        ...prev.permissions,
                                        [perm.key]: e.target.checked,
                                      },
                                    }))
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">
                                  {perm.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingMember(null);
                          }}
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdateMember}
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                    <button
                      type="button"
                      onClick={open2FAModal}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      {security.twoFactor ? "Manage" : "Enable"}
                      <ChevronRight size={14} className="text-gray-400" />
                    </button>
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
                      onClick={openSessionsModal}
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

                    <button
                      type="button"
                      onClick={openLoginHistoryModal}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <History
                          size={17}
                          className="text-gray-400"
                        />

                        <div>
                          <p className="text-xs font-medium">
                            Login history
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            View recent login activity and known devices.
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
                  onClick={handleRevokeAllSessions}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                >
                  <LogOut size={15} />
                  Sign out of all sessions
                </button>
              </SettingsSection>
            )}

            {/* =================================================
                SESSIONS MODAL
            ================================================== */}
            {showSessionsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold">Active Sessions</h2>
                    <button type="button" onClick={() => setShowSessionsModal(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800">
                      <X size={16} />
                    </button>
                  </div>

                  {sessionsError && (
                    <p className="mb-3 text-xs text-red-600">{sessionsError}</p>
                  )}

                  {sessionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-gray-400" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">No active sessions found.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-medium truncate">
                                  {session.device_info || session.user_agent || "Unknown Device"}
                                </p>
                                {session.is_current && (
                                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-[10px] text-gray-400">
                                IP: {session.ip_address || "Unknown"} | Last active: {formatTimestamp(session.last_active_at)}
                              </p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                Created: {formatTimestamp(session.created_at)} | Expires: {session.expires_at ? formatTimestamp(session.expires_at) : "Never"}
                              </p>
                            </div>
                            {!session.is_current && (
                              <button
                                onClick={() => handleRevokeSession(session.id)}
                                className="ml-2 rounded-lg border border-red-200 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button type="button" onClick={() => setShowSessionsModal(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium dark:border-gray-700">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                2FA MODAL
            ================================================== */}
            {show2FAModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold">
                      {twoFAStatus.enabled ? "Manage Two-Factor Authentication" : "Enable Two-Factor Authentication"}
                    </h2>
                    <button type="button" onClick={close2FAModal} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800">
                      <X size={16} />
                    </button>
                  </div>

                  {twoFAError && <p className="mb-3 text-xs text-red-600">{twoFAError}</p>}
                  {twoFASuccess && <p className="mb-3 text-xs text-green-600">{twoFASuccess}</p>}

                  {/* Step: Initial - Show status or start setup */}
                  {twoFAStep === "initial" && (
                    <div className="space-y-4">
                      {twoFAStatus.enabled ? (
                        <>
                          <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                            <p className="text-xs font-medium text-green-700 dark:text-green-300">
                              Two-factor authentication is enabled
                            </p>
                            <p className="mt-1 text-[10px] text-green-600 dark:text-green-400">
                              Your account is protected with an authenticator app.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500">
                              Backup codes remaining: {twoFAStatus.backupCodesCount || 0}
                            </p>
                            <button
                              type="button"
                              onClick={() => setTwoFAStep("disable")}
                              className="w-full rounded-xl border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                            >
                              Disable 2FA
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-gray-500">
                            Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to enter a code from your authenticator app when signing in.
                          </p>
                          <button
                            type="button"
                            onClick={handle2FASetup}
                            disabled={twoFALoading}
                            className="w-full rounded-xl bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900"
                          >
                            {twoFALoading ? "Setting up..." : "Get Started"}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Step: Scan QR Code */}
                  {twoFAStep === "scan" && twoFASetup && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">
                        1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                      </p>
                      <div className="flex justify-center">
                        <img
                          src={`data:image/png;base64,${twoFASetup.qrCode}`}
                          alt="2FA QR Code"
                          className="h-48 w-48 rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                        <p className="text-[10px] text-gray-400 mb-1">Or enter this code manually:</p>
                        <p className="font-mono text-xs font-medium break-all">{twoFASetup.secret}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTwoFAStep("verify")}
                        className="w-full rounded-xl bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {/* Step: Verify Code */}
                  {twoFAStep === "verify" && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">
                        2. Enter the 6-digit code from your authenticator app to verify setup
                      </p>
                      <input
                        type="text"
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center font-mono text-sm outline-none focus:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                      <button
                        type="button"
                        onClick={handle2FAVerify}
                        disabled={twoFALoading || twoFACode.length !== 6}
                        className="w-full rounded-xl bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900"
                      >
                        {twoFALoading ? "Verifying..." : "Verify & Enable"}
                      </button>
                    </div>
                  )}

                  {/* Step: Success */}
                  {twoFAStep === "success" && (
                    <div className="space-y-4">
                      <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                        <p className="text-xs font-medium text-green-700 dark:text-green-300">
                          Two-factor authentication is now enabled!
                        </p>
                      </div>
                      {twoFASetup?.backupCodes && (
                        <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
                          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-2">
                            Save your backup codes
                          </p>
                          <p className="text-[10px] text-yellow-600 dark:text-yellow-400 mb-2">
                            Store these codes safely. You can use them to sign in if you lose access to your authenticator app. Each code can only be used once.
                          </p>
                          <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                            {twoFASetup.backupCodes.map((code, i) => (
                              <span key={i} className="rounded bg-white px-2 py-1 dark:bg-gray-800">{code}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step: Disable 2FA */}
                  {twoFAStep === "disable" && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">
                        Enter your 2FA code to confirm disabling two-factor authentication.
                      </p>
                      <input
                        type="text"
                        value={twoFADisableCode}
                        onChange={(e) => setTwoFADisableCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center font-mono text-sm outline-none focus:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setTwoFAStep("initial")}
                          className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium dark:border-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handle2FADisable}
                          disabled={twoFALoading || twoFADisableCode.length !== 6}
                          className="flex-1 rounded-xl border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/30"
                        >
                          {twoFALoading ? "Disabling..." : "Disable 2FA"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =================================================
          LOGIN HISTORY MODAL
      ================================================== */}
      {showLoginHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Login History</h2>
              <button type="button" onClick={closeLoginHistoryModal} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800">
                <X size={16} />
              </button>
            </div>

            {loginHistoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Login Events */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Login Activity</h3>
                  {loginHistory.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">No login history found.</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {loginHistory.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-medium truncate">
                                  {event.device_name || "Unknown Device"}
                                </p>
                                {event.is_new_device && (
                                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                                    New Device
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-[10px] text-gray-400">
                                {event.browser} on {event.operating_system}
                              </p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                IP: {event.ip_address || "Unknown"} | {formatTimestamp(event.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Known Devices */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Known Devices</h3>
                  {knownDevices.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">No known devices.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {knownDevices.map((device) => (
                        <div
                          key={device.device_id_hash || device.id}
                          className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{device.device_name || "Unknown Device"}</p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                {device.browser} on {device.operating_system}
                              </p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                First seen: {formatTimestamp(device.first_seen_at)} | Last seen: {formatTimestamp(device.last_seen_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button type="button" onClick={closeLoginHistoryModal} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium dark:border-gray-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
    <section className="rounded-3xl border border-violet-100 bg-white/90 p-5 shadow-xl shadow-violet-500/5 backdrop-blur dark:border-violet-900/40 dark:bg-slate-900/90 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 via-fuchsia-100 to-pink-100 text-violet-600 dark:from-violet-900/50 dark:via-fuchsia-900/40 dark:to-pink-900/30 dark:text-violet-300">
          <Icon
            size={18}
            className="text-violet-600 dark:text-violet-300"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-violet-600/70 dark:text-violet-300/60">
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-sky-100 text-violet-600 dark:from-violet-900/50 dark:to-sky-900/30 dark:text-violet-300">
        <Icon
          size={15}
          className="text-violet-600 dark:text-violet-300"
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
            ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500"
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
   THEME CARD (DISABLED - DEBUG)
========================================================= */

/*
const ThemeCard = ({
  label,
  description,
  icon: Icon,
  selected,
  onClick,
}) => {
  return (
    <button type="button" onClick={onClick} className="relative rounded-2xl border p-4 text-left transition border-surface-200 bg-white hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:hover:bg-surface-800">
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white dark:bg-primary dark:text-primary-900">
          <Check size={12} />
        </div>
      )

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-subtle dark:bg-primary-subtle">
        <Icon size={17} className="text-white" />
      </div>

      <p className="mt-4 text-xs font-semibold text-text-primary dark:text-text-primary-dark">{label}</p>
      <p className="mt-1 text-[10px] leading-4 text-text-tertiary dark:text-text-tertiary-dark">{description}</p>
    </button>
  );
};
*/

const ThemeCard = ({ label, description, icon, selected, onClick }) => {
  const icons = {
    Sun: <Sun size={17} className="text-white" />,
    Moon: <Moon size={17} className="text-white" />,
    Monitor: <Monitor size={17} className="text-white" />,
  };
  return (
    <button type="button" onClick={onClick} className="relative rounded-2xl border p-4 text-left transition border-surface-200 bg-white hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:hover:bg-surface-800">
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white dark:bg-primary dark:text-primary-900">
          <Check size={12} />
        </div>
      )}
      {icons[icon] || null}
      <p className="mt-4 text-xs font-semibold text-text-primary dark:text-text-primary-dark">{label}</p>
      <p className="mt-1 text-[10px] leading-4 text-text-tertiary dark:text-text-tertiary-dark">{description}</p>
    
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
  channelType,
  status,
  enabled,
  saving,
  onChange,
}) => {
  const statusStyles = {
    connected: "bg-success-subtle text-success dark:bg-success-subtle dark:text-success",
    disconnected: "bg-warning-subtle text-warning dark:bg-warning-subtle dark:text-warning",
    not_configured: "bg-surface-100 text-text-tertiary dark:bg-surface-800 dark:text-text-tertiary-dark",
  };

  const statusLabels = {
    connected: "Connected",
    disconnected: "Disconnected",
    not_configured: "Not configured",
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-4">
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
          <p className="text-xs font-semibold text-text-primary dark:text-text-primary-dark">
            {title}
          </p>

          <span className={`rounded-full px-2 py-1 text-[9px] font-medium ${statusStyles[status] || statusStyles.not_configured}`}>
            {statusLabels[status] || "Not configured"}
          </span>
        </div>

        <p className="mt-1 text-[10px] leading-4 text-text-tertiary dark:text-text-tertiary-dark">
          {description}
        </p>
      </div>

      {saving ? (
        <Loader2 size={16} className="animate-spin text-text-tertiary" />
      ) : (
        <Toggle
          checked={enabled}
          onChange={onChange}
        />
      )}
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
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/60">
      <div className="flex items-start gap-3">
        <Icon
          size={15}
          className="mt-0.5 shrink-0 text-text-tertiary"
        />

        <p className="text-[10px] leading-5 text-text-tertiary dark:text-text-tertiary-dark">
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
    <div className="h-px bg-gradient-to-r from-violet-100 via-fuchsia-100 to-sky-100 dark:from-violet-900/40 dark:via-fuchsia-900/30 dark:to-sky-900/30" />
  );
};

/* =========================================================
   COMMON CLASSES
========================================================= */

const inputClass = `
  h-10 w-full rounded-xl
  border border-violet-200
  bg-violet-50/50
  px-3
  text-sm text-gray-900
  outline-none
  transition
  placeholder:text-violet-300
  focus:border-violet-400
  focus:bg-white
  focus:ring-2
  focus:ring-violet-200
  dark:border-violet-800
  dark:bg-violet-950/20
  dark:text-gray-100
  dark:placeholder:text-violet-400/50
  dark:focus:border-violet-600
  dark:focus:bg-slate-900
  dark:focus:ring-violet-900/50
`;

const textareaClass = `
  w-full rounded-xl
  border border-violet-200
  bg-violet-50/50
  px-3 py-3
  text-sm text-gray-900
  outline-none
  transition
  placeholder:text-violet-300
  focus:border-violet-400
  focus:bg-white
  focus:ring-2
  focus:ring-violet-200
  dark:border-violet-800
  dark:bg-violet-950/20
  dark:text-gray-100
  dark:placeholder:text-violet-400/50
  dark:focus:border-violet-600
  dark:focus:bg-slate-900
`;

const subHeadingClass =
  "text-xs font-semibold text-violet-900 dark:text-violet-100";

const descriptionClass =
  "mt-1 text-[10px] leading-4 text-violet-500/70 dark:text-violet-300/60";

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

const Instagram = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/* =========================================================
   EXPORT
========================================================= */

export default Settings;