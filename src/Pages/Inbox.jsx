import React, { useMemo, useState, useEffect, useRef } from "react";
import {
    Search,
    MoreHorizontal,
    Phone,
    Video,
    PanelRight,
    Send,
    Paperclip,
    Smile,
    Bot,
    User,
    CheckCheck,
    Clock3,
    MessageSquare,
    X,
    ShoppingBag,
    MapPin,
    Mail,
    ChevronDown,
    Sparkles,
    ArrowLeft,
    Loader2,
    AlertCircle,
    RotateCcw,
    ExternalLink,
    Globe,
    AlertTriangle,
    UserCheck,
    Copy,
    Check,
    Calendar,
    Activity,
    Tag,
} from "lucide-react";
import {
    WhatsAppIcon,
    InstagramIcon,
    FacebookIcon,
    TelegramIcon,
    TikTokIcon,
    XIcon,
    WebsiteIcon,
    SocialIcon,
} from "../Components/ui";
import { useConversations } from "../hooks/useConversations";
import { useAIChat } from "../hooks/useAIChat";
import { useSettings } from "../hooks/useSettings";
import { useProducts } from "../hooks/useProducts";

/* =========================================================
 CHANNEL BADGE & STYLES (WhatsApp, Telegram, IG, FB, Web)
========================================================= */

const getChannelBadge = (channel) => {
    const norm = String(channel || "Website").toLowerCase();

    if (norm.includes("whatsapp")) {
        return {
            label: "WhatsApp",
            style:
                "bg-emerald-50 text-[#16A34A] border-emerald-200",
            dot: "bg-[#16A34A]",
            icon: WhatsAppIcon,
        };
    }
    if (norm.includes("telegram")) {
        return {
            label: "Telegram",
            style:
                "bg-sky-50 text-sky-700 border-sky-200",
            dot: "bg-sky-500",
            icon: TelegramIcon,
        };
    }
    if (norm.includes("instagram")) {
        return {
            label: "Instagram",
            style:
                "bg-pink-50 text-pink-700 border-pink-200",
            dot: "bg-pink-500",
            icon: InstagramIcon,
        };
    }
    if (norm.includes("facebook")) {
        return {
            label: "Facebook",
            style:
                "bg-blue-50 text-[#2563EB] border-blue-200",
            dot: "bg-[#2563EB]",
            icon: FacebookIcon,
        };
    }
    if (norm.includes("tiktok")) {
        return {
            label: "TikTok",
            style:
                "bg-slate-100 text-slate-900 border-slate-300",
            dot: "bg-slate-900",
            icon: TikTokIcon,
        };
    }
    if (norm.includes("twitter") || norm.includes("x")) {
        return {
            label: "X (Twitter)",
            style:
                "bg-slate-100 text-slate-900 border-slate-300",
            dot: "bg-slate-900",
            icon: XIcon,
        };
    }
    return {
        label: "Website",
        style:
            "bg-violet-50 text-violet-700 border-violet-200",
        dot: "bg-violet-500",
        icon: WebsiteIcon,
    };
};

/* =========================================================
 INBOX COMPONENT — FIXED VIEWPORT 3-PANE LAYOUT
========================================================= */

const Inbox = () => {
    const {
        conversations = [],
        setConversations,
        loading,
        error,
        refetch,
        selectConversation,
        sendMessage: apiSendMessage,
        takeOver: apiTakeOver,
        returnToAI: apiReturnToAI,
        markResolved: apiMarkResolved,
        reopenConversation: apiReopenConversation,
        sendingStates = {},
        isOnline,
    } = useConversations();

    const { sendToAI } = useAIChat();
    const { settings } = useSettings();
    const { products = [] } = useProducts();

    const currency = settings?.general?.currency || "GHS";
    const timezone = settings?.general?.timezone || "Africa/Accra";
    const aiEnabled = settings?.ai?.enabled ?? true;
    const autoReply = settings?.ai?.autoReply ?? true;
    const allowCustomerChat = settings?.customer?.allowCustomerChat ?? true;
    const sellerId = settings?.general?.sellerId || "store";

    const [selectedId, setSelectedId] = useState(null);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [showCustomerPanel, setShowCustomerPanel] = useState(true);
    const [showCustomerMenu, setShowCustomerMenu] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [channelFilter, setChannelFilter] = useState("All");
    const [mobileView, setMobileView] = useState("list"); // 'list' | 'chat'

    const messagesEndRef = useRef(null);

    // Map real products from catalog for instant photo & price lookup
    const catalogMap = useMemo(() => {
        const map = new Map();
        if (Array.isArray(products)) {
            products.forEach((p) => {
                if (p.name) map.set(p.name.toLowerCase().trim(), p);
                if (p.id) map.set(p.id, p);
            });
        }
        return map;
    }, [products]);

    // Selected Conversation
    const selectedConversation = useMemo(() => {
        return conversations.find((c) => c.id === selectedId) || null;
    }, [conversations, selectedId]);

    // Safe fallback to ensure the three-pane shell never crashes
    const activeConversation = selectedConversation || {
        id: null,
        name: "No conversation selected",
        initials: "—",
        status: "offline",
        channel: "Inbox",
        mode: "none",
        conversationStatus: "idle",
        messages: [],
        productsDiscussed: [],
        orders: [],
        phone: "—",
        email: "—",
        location: "—",
    };

    const hasSelectedConversation = Boolean(selectedConversation);

    // Auto-select first conversation on initial load if available
    useEffect(() => {
        if (conversations.length > 0 && !selectedId) {
            const firstId = conversations[0].id;
            setSelectedId(firstId);
            selectConversation(firstId);
        }
    }, [conversations, selectedId, selectConversation]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeConversation.messages]);

    // Lock parent layout scrolling so only the 3 panes can scroll independently
    useEffect(() => {
        const mainEl = document.querySelector("main");
        if (mainEl) {
            const prevOverflow = mainEl.style.overflow;
            mainEl.style.overflow = "hidden";
            return () => {
                mainEl.style.overflow = prevOverflow;
            };
        }
    }, []);

    /* =======================================================
    FILTERING & SEARCH
    ======================================================= */
    const filteredConversations = useMemo(() => {
        const query = search.toLowerCase().trim();

        return conversations.filter((conversation) => {
            const name = String(conversation.name || "").toLowerCase();
            const lastMsg = String(conversation.lastMessage || "").toLowerCase();
            const ch = String(conversation.channel || "").toLowerCase();

            const matchesSearch =
                !query ||
                name.includes(query) ||
                lastMsg.includes(query) ||
                ch.includes(query);

            let matchesFilter = true;
            if (activeFilter === "Unread") {
                matchesFilter = Number(conversation.unread || 0) > 0;
            } else if (activeFilter === "AI") {
                matchesFilter = conversation.mode === "ai";
            } else if (activeFilter === "Human") {
                matchesFilter =
                    conversation.mode === "human" || conversation.mode === "handoff";
            }

            let matchesChannel = true;
            if (channelFilter !== "All") {
                matchesChannel = ch.includes(channelFilter.toLowerCase());
            }

            return matchesSearch && matchesFilter && matchesChannel;
        });
    }, [conversations, search, activeFilter, channelFilter]);

    const unreadTotal = useMemo(() => {
        return conversations.reduce(
            (acc, c) => acc + (Number(c.unread || 0) > 0 ? 1 : 0),
            0
        );
    }, [conversations]);

    /* =======================================================
    SELECTION & NAVIGATION
    ======================================================= */
    const handleSelectConversation = (id) => {
        setSelectedId(id);
        selectConversation(id);
        setMobileView("chat");
    };

    const goBackToList = () => {
        setMobileView("list");
    };

    /* =======================================================
    SEND MESSAGE
    ======================================================= */
    const handleSendMessage = async (event) => {
        event.preventDefault();
        const trimmed = message.trim();
        if (!trimmed || !hasSelectedConversation) return;

        setMessage("");

        try {
            await apiSendMessage(selectedConversation.id, trimmed);
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    /* =======================================================
    AI / HANDOFF ACTIONS
    ======================================================= */
    const handleTakeOver = async () => {
        if (!selectedId) return;
        try {
            await apiTakeOver(selectedId);
        } catch (err) {
            console.error("Failed to take over:", err);
        }
    };

    const handleReturnToAI = async () => {
        if (!selectedId) return;
        try {
            await apiReturnToAI(selectedId);
        } catch (err) {
            console.error("Failed to return to AI:", err);
        }
    };

    const handleMarkResolved = async () => {
        if (!selectedId) return;
        try {
            await apiMarkResolved(selectedId);
        } catch (err) {
            console.error("Failed to mark resolved:", err);
        }
    };

    const handleReopenConversation = async () => {
        if (!selectedId) return;
        try {
            await apiReopenConversation(selectedId);
        } catch (err) {
            console.error("Failed to reopen conversation:", err);
        }
    };

    /* =======================================================
    AI AUTOMATIC RESPONSE HANDLING
    ======================================================= */
    useEffect(() => {
        if (!aiEnabled || !autoReply) return;
        if (
            selectedConversation &&
            selectedConversation.mode === "ai" &&
            Array.isArray(selectedConversation.messages) &&
            selectedConversation.messages.length > 0
        ) {
            const lastMessage =
                selectedConversation.messages[
                selectedConversation.messages.length - 1
                ];

            if (lastMessage?.sender === "customer") {
                const hasAIResponse = selectedConversation.messages.some(
                    (msg, idx) =>
                        msg.sender === "ai" &&
                        idx > selectedConversation.messages.indexOf(lastMessage)
                );

                if (!hasAIResponse) {
                    const conversationHistory = selectedConversation.messages
                        .slice(-6)
                        .map((msg) => ({
                            id: msg.id,
                            sender: msg.sender,
                            content: msg.content,
                            time: msg.time,
                        }));

                    sendToAI(
                        lastMessage.content,
                        selectedConversation.id,
                        conversationHistory
                    )
                        .then((aiResponse) => {
                            if (aiResponse.requiresHandoff) {
                                setConversations((current) =>
                                    current.map((conv) =>
                                        conv.id === selectedId
                                            ? {
                                                ...conv,
                                                mode: "handoff",
                                                conversationStatus: "handed_off",
                                            }
                                            : conv
                                    )
                                );
                            } else {
                                const aiMessage = {
                                    id: Date.now(),
                                    sender: "ai",
                                    content: aiResponse.response,
                                    time: new Date().toLocaleTimeString([], {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        timeZone: timezone,
                                    }),
                                };

                                setConversations((current) =>
                                    current.map((conv) =>
                                        conv.id === selectedId
                                            ? {
                                                ...conv,
                                                lastMessage: aiResponse.response,
                                                time: aiMessage.time,
                                                messages: [...(conv.messages || []), aiMessage],
                                            }
                                            : conv
                                    )
                                );
                            }
                        })
                        .catch((err) => {
                            console.error("AI response error:", err);
                        });
                }
            }
        }
    }, [
        selectedConversation?.messages,
        selectedConversation?.mode,
        selectedId,
        sendToAI,
        aiEnabled,
        autoReply,
        timezone,
        setConversations,
        selectedConversation,
    ]);

    return (
        /* 
        LAYOUT GUARANTEE:
        The container cancels outer page margins with negative margins and locks
        height to exactly calc(100vh - 4rem) so the page itself NEVER scrolls.
        Only the 3 inner panes can scroll independently.
        */
        <div className="-m-4 sm:-m-6 lg:-m-8 flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] min-h-0 min-w-0 flex-col overflow-hidden bg-[#F8FAFC] border-t border-[#E2E8F0]">
            {/* =====================================================
 TOP INBOX UTILITY BAR (FIXED)
 ====================================================== */}
            <div className="shrink-0 h-14 border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between bg-[#FFFFFF] z-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                        <MessageSquare size={18} strokeWidth={2.2} />
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-base font-bold text-[#0F172A]">
                            Inbox
                        </h1>
                        <span className="hidden sm:inline-flex rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 text-[11px] font-semibold text-[#2563EB]">
                            {conversations.length} total
                        </span>
                        {unreadTotal > 0 && (
                            <span className="rounded-full bg-[#DC2626] text-white px-2 py-0.5 text-[10px] font-bold">
                                {unreadTotal} unread
                            </span>
                        )}
                    </div>
                </div>

                {/* Right Status & Channel Pills */}
                <div className="flex items-center gap-3 ">
                    {/* Channel Filters Pill Dropdown */}
                    <div className="hidden lg:flex items-center gap-1.5">
                        {["All", "WhatsApp", "Telegram", "Instagram", "Facebook", "Website"].map(
                            (ch) => (
                                <button
                                    key={ch}
                                    type="button"
                                    onClick={() => setChannelFilter(ch)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${channelFilter === ch
                                        ? "bg-blue-700 text-white shadow-xs"
                                        : "hover:bg-gray-200 hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                                        }`}
                                >
                                    {ch !== "All" && (
                                        <SocialIcon
                                            name={ch}
                                            size={14}
                                            colorMode={channelFilter === ch ? "monochrome" : "colored"}
                                        />
                                    )}
                                    <span>{ch}</span>
                                </button>
                            )
                        )}
                    </div>

                    {/* AI Active Indicator */}
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
                        <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
                        <span>{aiEnabled ? "AI Active" : "AI Inactive"}</span>
                    </div>
                </div>
            </div>

            {/* =====================================================
 THREE-PANE BODY (NO PAGE OVERFLOW)
 ====================================================== */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
                {/* ===================================================
 PANE 1 (LEFT): CONVERSATION LIST (INDEPENDENT SCROLL)
 ==================================================== */}
                <aside
                    className={`
 h-full min-h-0 w-full md:w-[320px] lg:w-[340px] xl:w-[360px] shrink-0 flex-col border-r border-[#E2E8F0] bg-[#FFFFFF] overflow-hidden
 ${mobileView === "list" ? "flex" : "hidden md:flex"}
 `}
                >
                    {/* Fixed Search & Filters Header */}
                    <div className="shrink-0 p-3.5 border-b border-[#E2E8F0] space-y-2.5 bg-[#FFFFFF]">
                        <div className="relative">
                            <Search
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
                            />
                        </div>

                        {/* Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                            {["All", "Unread", "AI", "Human"].map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer shrink-0 ${activeFilter === filter
                                        ? "bg-[#2563EB] text-white shadow-xs"
                                        : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SCROLL AREA 1: Only conversation list scrolls */}
                    <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#E2E8F0]">
                        {loading ? (
                            <div className="p-8 text-center space-y-2.5">
                                <Loader2
                                    size={24}
                                    className="mx-auto text-[#2563EB] animate-spin"
                                />
                                <p className="text-xs font-medium text-[#64748B]">
                                    Loading conversations...
                                </p>
                            </div>
                        ) : error && conversations.length === 0 ? (
                            <div className="p-6 text-center space-y-2">
                                <AlertCircle size={24} className="mx-auto text-[#DC2626]" />
                                <p className="text-xs font-semibold text-[#0F172A]">
                                    Failed to load conversations
                                </p>
                                <p className="text-[11px] text-[#64748B]">{error}</p>
                                <button
                                    type="button"
                                    onClick={refetch}
                                    className="mt-2 text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                                >
                                    <RotateCcw size={12} />
                                    <span>Retry</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                {(error || !isOnline) && conversations.length > 0 && (
                                    <div className="p-3 border-b border-amber-200 bg-amber-50/50">
                                        <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100">
                                                <AlertTriangle size={12} />
                                            </span>
                                            <span>{!isOnline ? "Offline — showing saved data" : error}</span>
                                            {isOnline && error && (
                                                <button
                                                    type="button"
                                                    onClick={refetch}
                                                    className="ml-auto text-xs font-semibold text-amber-700 hover:underline inline-flex items-center gap-1"
                                                >
                                                    <RotateCcw size={11} />
                                                    <span>Retry</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {filteredConversations.length === 0 ? (
                                    <div className="p-8 text-center space-y-2">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B]">
                                            <Search size={18} />
                                        </div>
                                        <p className="text-xs font-semibold text-[#0F172A]">
                                            No conversations found
                                        </p>
                                        <p className="text-[11px] text-[#64748B]">
                                            Try another filter or search term.
                                        </p>
                                    </div>
                                ) : (
                                    filteredConversations.map((conv) => {
                                        const isSelected = conv.id === selectedId;
                                        const channelBadge = getChannelBadge(conv.channel);
                                        const unreadCount = Number(conv.unread || 0);

                                        return (
                                            <button
                                                key={conv.id}
                                                type="button"
                                                onClick={() => handleSelectConversation(conv.id)}
                                                className={`w-full text-left p-3.5 transition-all duration-150 flex items-start gap-3 cursor-pointer ${isSelected
                                                    ? "bg-blue-50/70 border-l-4 border-l-[#2563eb]"
                                                    : "hover:bg-slate-50 border-l-4 border-l-transparent"
                                                    }`}
                                            >
                                                {/* Customer Avatar with status dot */}
                                                <div className="relative shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs">
                                                        {conv.initials || "C"}
                                                    </div>
                                                    {conv.status === "online" && (
                                                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                                    )}
                                                </div>

                                                {/* Metadata & Message */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <h3
                                                            className={`text-xs truncate ${unreadCount > 0
                                                                ? "font-bold text-slate-900"
                                                                : "font-semibold text-slate-800"
                                                                }`}
                                                        >
                                                            {conv.name || "Customer"}
                                                        </h3>
                                                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                                                            {conv.time || ""}
                                                        </span>
                                                    </div>

                                                    {/* Channel & Mode Badges */}
                                                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${channelBadge.style}`}
                                                        >
                                                            <channelBadge.icon size={11} />
                                                            {channelBadge.label}
                                                        </span>

                                                        {conv.mode === "ai" && (
                                                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 border border-purple-200 px-1.5 py-0.5 text-[9px] font-semibold text-purple-700">
                                                                <Bot size={10} />
                                                                AI
                                                            </span>
                                                        )}

                                                        {conv.mode === "human" && (
                                                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700">
                                                                <User size={10} />
                                                                Agent
                                                            </span>
                                                        )}

                                                        {conv.mode === "handoff" && (
                                                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                                                                <AlertTriangle size={10} />
                                                                Handoff
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Last Message Preview */}
                                                    <div className="mt-1.5 flex items-center justify-between gap-2">
                                                        <p
                                                            className={`text-xs truncate ${unreadCount > 0
                                                                ? "font-semibold text-slate-900"
                                                                : "text-slate-500"
                                                                }`}
                                                        >
                                                            {conv.lastMessage || "No messages yet"}
                                                        </p>

                                                        {unreadCount > 0 && (
                                                            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[9px] font-bold text-white shrink-0">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </>
                        )}
                    </div>
                </aside>

                {/* ===================================================
 PANE 2 (CENTER): ACTIVE CHAT (INDEPENDENT SCROLL)
 ==================================================== */}
                <section
                    className={`
 h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-50/70
 ${mobileView === "chat" ? "flex" : "hidden md:flex"}
 `}
                >
                    {/* Fixed Chat Header */}
                    <header className="shrink-0 h-16 border-b border-slate-200/90 bg-white px-4 sm:px-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Mobile Back Button */}
                            <button
                                type="button"
                                onClick={goBackToList}
                                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                aria-label="Back to conversations"
                            >
                                <ArrowLeft size={18} />
                            </button>

                            {/* Customer Avatar with status dot */}
                            <div className="relative shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs">
                                    {activeConversation.initials || "C"}
                                </div>
                                {activeConversation.status === "online" && (
                                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                                )}
                            </div>

                            {/* Customer Info */}
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                                        {(() => {
                                            const ChannelIcon = getChannelBadge(activeConversation.channel).icon;
                                            return <ChannelIcon size={15} className="shrink-0" />;
                                        })()}
                                        {activeConversation.name}
                                    </h2>
                                    <span
                                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getChannelBadge(activeConversation.channel).style
                                            }`}
                                    >
                                        {getChannelBadge(activeConversation.channel).label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                    <span className="capitalize">
                                        {activeConversation.status === "online"
                                            ? "Online"
                                            : "Offline"}
                                    </span>
                                    <span>•</span>
                                    <span className="capitalize">
                                        {String(
                                            activeConversation.conversationStatus || "active"
                                        ).replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                title="Call Customer"
                                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            >
                                <Phone size={16} />
                            </button>
                            <button
                                type="button"
                                title="Video Call"
                                className="hidden sm:inline-flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            >
                                <Video size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCustomerPanel(!showCustomerPanel)}
                                title={
                                    showCustomerPanel
                                        ? "Hide Customer Panel"
                                        : "Show Customer Panel"
                                }
                                className={`p-2 rounded-xl transition ${showCustomerPanel
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                <PanelRight size={16} />
                            </button>
                        </div>
                    </header>

                    {/* Fixed AI Mode Banner */}
                    <div className="shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-xs px-4 py-2.5 flex items-center justify-between gap-3 z-10">
                        {!aiEnabled ? (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                    <Bot size={14} />
                                </span>
                                <span>AI assistant is disabled in settings</span>
                            </div>
                        ) : !autoReply ? (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                    <Bot size={14} />
                                </span>
                                <span>Automatic AI replies are paused</span>
                            </div>
                        ) : activeConversation.mode === "ai" ? (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-xs text-slate-700 min-w-0">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                        <Bot size={14} />
                                    </span>
                                    <span className="truncate">
                                        <strong className="font-semibold text-slate-900">
                                            AI is handling
                                        </strong>{" "}
                                        this conversation & customer inquiries
                                    </span>
                                </div>
                                {settings?.ai?.humanHandoff !== false && (
                                    <button
                                        type="button"
                                        onClick={handleTakeOver}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0 shadow-xs"
                                    >
                                        <UserCheck size={13} />
                                        <span>Take over</span>
                                    </button>
                                )}
                            </div>
                        ) : activeConversation.mode === "human" ? (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-xs text-slate-700 min-w-0">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                        <User size={14} />
                                    </span>
                                    <span className="truncate">
                                        <strong className="font-semibold text-slate-900">
                                            You are in control
                                        </strong>{" "}
                                        of this chat
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleReturnToAI}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/60 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer shrink-0"
                                >
                                    <Sparkles size={13} />
                                    <span>Return to AI</span>
                                </button>
                            </div>
                        ) : activeConversation.mode === "handoff" ? (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 text-xs text-amber-700 min-w-0">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                        <Clock3 size={14} />
                                    </span>
                                    <span className="truncate font-semibold">
                                        Customer or AI requested human intervention!
                                    </span>
                                </div>
                                {settings?.ai?.humanHandoff !== false && (
                                    <button
                                        type="button"
                                        onClick={handleTakeOver}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-xs"
                                    >
                                        <UserCheck size={13} />
                                        <span>Take over</span>
                                    </button>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* SCROLL AREA 2: Only message history scrolls */}
                    {!hasSelectedConversation ? (
                        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-xs">
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-base font-bold text-slate-800">
                                {loading
                                    ? "Loading your inbox..."
                                    : error && conversations.length === 0
                                        ? "Inbox is offline"
                                        : "Select a conversation"}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 max-w-sm">
                                {loading
                                    ? "Connecting to message stream..."
                                    : error && conversations.length === 0
                                        ? "Couldn't connect to conversations service. The interface is ready to retry."
                                        : "Choose a customer from the left list to view chat history and start replying."}
                            </p>
                            {(error && conversations.length === 0) && (
                                <button
                                    type="button"
                                    onClick={refetch}
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] text-white px-4 py-2 text-xs font-semibold shadow-sm hover:bg-blue-700 transition"
                                >
                                    <RotateCcw size={14} />
                                    Retry Connection
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5">
                            {/* Date Separator */}
                            <div className="flex items-center justify-center">
                                <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[10px] font-semibold text-slate-600">
                                    Today
                                </span>
                            </div>

                            {(error || !isOnline) && (
                                <div className="flex items-center justify-center px-4 py-2 border-b border-amber-200/50 bg-amber-50/50">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100">
                                            <AlertTriangle size={10} />
                                        </span>
                                        <span>{!isOnline ? "Offline — showing saved data" : error}</span>
                                    </span>
                                </div>
                            )}

                            {/* Messages */}
                            {activeConversation.messages.map((item) => {
                                const isCustomer = item.sender === "customer";
                                const isAI = item.sender === "ai";
                                const isHuman = item.sender === "human";

                                return (
                                    <div
                                        key={item.id}
                                        className={`flex ${isCustomer ? "justify-start" : "justify-end"
                                            }`}
                                    >
                                        <div
                                            className={`flex max-w-[90%] sm:max-w-[75%] flex-col ${isCustomer ? "items-start" : "items-end"
                                                }`}
                                        >
                                            {/* Sender label */}
                                            {!isCustomer && (
                                                <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                                    {isAI ? (
                                                        <>
                                                            <Sparkles size={11} className="text-purple-500" />
                                                            <span className="text-purple-600 font-semibold">
                                                                ThreadOS AI
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <User size={11} className="text-blue-500" />
                                                            <span className="text-slate-600 font-semibold">
                                                                You (Agent)
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Bubble */}
                                            <div
                                                className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-5 shadow-xs ${isCustomer
                                                    ? "rounded-tl-xs bg-white text-slate-800 border border-slate-200/80"
                                                    : isAI
                                                        ? "rounded-tr-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                                        : "rounded-tr-xs bg-slate-900 text-white"
                                                    }`}
                                            >
                                                {item.content}
                                            </div>

                                            {/* Timestamp & checkmark */}
                                            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                                <span>{item.time}</span>
                                                {isHuman && (
                                                    <CheckCheck size={12} className="text-blue-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* ===================================================
 AI PRODUCT RECOMMENDATIONS (REAL CATALOG IMAGES)
 ==================================================== */}
                            {settings?.ai?.productRecommendations !== false &&
                                activeConversation.productsDiscussed &&
                                activeConversation.productsDiscussed.length > 0 && (
                                    <div className="ml-auto w-full max-w-[92%] sm:max-w-[80%] rounded-2xl border border-blue-200 bg-white p-4 shadow-sm space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    <Sparkles size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">
                                                        AI Fashion Commerce Insight
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        Products discussed with customer
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 border border-blue-200/60">
                                                {activeConversation.productsDiscussed.length}{" "}
                                                recommended
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {activeConversation.productsDiscussed.map(
                                                (productName, idx) => {
                                                    const catalogProduct = catalogMap.get(
                                                        String(productName).toLowerCase().trim()
                                                    );

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70"
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0">
                                                                {/* Real Image or Icon */}
                                                                <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                                                                    {catalogProduct?.image ? (
                                                                        <img
                                                                            src={catalogProduct.image}
                                                                            alt={productName}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                                            <ShoppingBag size={18} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-slate-900 truncate">
                                                                        {productName}
                                                                    </p>
                                                                    <p className="text-[11px] font-extrabold text-[#2563eb] mt-0.5">
                                                                        {catalogProduct?.price
                                                                            ? `${currency} ${Number(
                                                                                catalogProduct.price
                                                                            ).toFixed(2)}`
                                                                            : "View Catalog"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <a
                                                                href={`/store/${sellerId}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-xs shrink-0"
                                                            >
                                                                <span>Store</span>
                                                                <ExternalLink size={11} />
                                                            </a>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Fixed Bottom Message Composer */}
                    <div className="shrink-0 p-3 sm:p-4 border-t border-slate-200/90 bg-white z-10">
                        {activeConversation.conversationStatus === "resolved" && (
                            <div className="mb-2.5 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 border border-slate-200 text-xs">
                                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                    <CheckCheck size={14} className="text-emerald-500" />
                                    Conversation was marked resolved
                                </span>
                                <button
                                    type="button"
                                    onClick={handleReopenConversation}
                                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                                >
                                    Reopen
                                </button>
                            </div>
                        )}

                        <form
                            onSubmit={handleSendMessage}
                            className="w-full max-w-3xl mx-auto"
                        >
                            <div
                                className={`rounded-2xl border border-slate-200 bg-slate-50/60 p-2 transition focus-within:border-blue-500 focus-within:bg-white shadow-xs ${!hasSelectedConversation || !allowCustomerChat
                                    ? "opacity-60"
                                    : ""
                                    }`}
                            >
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                    rows={2}
                                    disabled={!hasSelectedConversation || !allowCustomerChat || !isOnline}
                                    placeholder={
                                        !hasSelectedConversation
                                            ? "Select a conversation to reply..."
                                            : !allowCustomerChat
                                                ? "Customer chat is disabled in settings"
                                                : !isOnline
                                                    ? "You're offline — reconnect to send messages"
                                                    : "Type your reply... (Press Enter to send)"
                                    }
                                    className="w-full resize-none bg-transparent px-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed"
                                />

                                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            title="Attach file"
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
                                        >
                                            <Paperclip size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            title="Insert emoji"
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
                                        >
                                            <Smile size={15} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {activeConversation.conversationStatus !== "resolved" &&
                                            hasSelectedConversation && (
                                                <button
                                                    type="button"
                                                    onClick={handleMarkResolved}
                                                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                                >
                                                    Resolve
                                                </button>
                                            )}

                                        <button
                                            type="submit"
                                            disabled={
                                                !hasSelectedConversation ||
                                                !message.trim() ||
                                                !allowCustomerChat ||
                                                !isOnline ||
                                                sendingStates[selectedId] === "sending"
                                            }
                                            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${sendingStates[selectedId] === "sending"
                                                ? "bg-amber-600"
                                                : sendingStates[selectedId] === "failed"
                                                    ? "bg-rose-600"
                                                    : "bg-[#2563eb] hover:bg-blue-700"
                                                }`}
                                        >
                                            <span>
                                                {sendingStates[selectedId] === "sending"
                                                    ? "Sending..."
                                                    : sendingStates[selectedId] === "failed"
                                                        ? "Failed - Retry"
                                                        : "Send"}
                                            </span>
                                            {sendingStates[selectedId] === "sending" ? (
                                                <Loader2 size={13} className="animate-spin" />
                                            ) : sendingStates[selectedId] === "failed" ? (
                                                <RotateCcw size={13} />
                                            ) : (
                                                <Send size={13} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                {/* ===================================================
 PANE 3 (RIGHT): CUSTOMER PROFILE (INDEPENDENT SCROLL)
 ==================================================== */}
                {showCustomerPanel && (
                    <aside className="hidden xl:flex h-full min-h-0 w-[310px] 2xl:w-[350px] shrink-0 flex-col border-l border-slate-200/80 bg-white overflow-hidden shadow-xs">
                        {/* Fixed Header */}
                        <div className="shrink-0 h-16 border-b border-slate-200/90 px-4 flex items-center justify-between bg-white z-20 relative">
                            <div className="flex items-center gap-2">
                                <User size={15} className="text-slate-400 shrink-0" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Customer Profile
                                </h3>
                            </div>

                            <div className="flex items-center gap-1">
                                {/* Actions Menu Trigger ⋯ */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomerMenu((prev) => !prev)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                        title="Customer Actions"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>

                                    {/* Actions Dropdown */}
                                    {showCustomerMenu && (
                                        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (activeConversation.phone && activeConversation.phone !== "—") {
                                                        navigator.clipboard.writeText(activeConversation.phone);
                                                        setCopiedPhone(true);
                                                        setTimeout(() => setCopiedPhone(false), 2000);
                                                    }
                                                    setShowCustomerMenu(false);
                                                }}
                                                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-100 cursor-pointer"
                                            >
                                                {copiedPhone ? <Check size={14} className="text-emerald-500 shrink-0" /> : <Copy size={14} className="text-slate-400 shrink-0" />}
                                                <span>{copiedPhone ? "Phone Copied!" : "Copy Phone Number"}</span>
                                            </button>

                                            {activeConversation.mode === "ai" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        apiTakeOver(activeConversation.id);
                                                        setShowCustomerMenu(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-amber-600 hover:bg-amber-50 cursor-pointer"
                                                >
                                                    <User size={14} className="shrink-0" />
                                                    <span>Take Over Chat</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        apiReturnToAI(activeConversation.id);
                                                        setShowCustomerMenu(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-purple-600 hover:bg-purple-50 cursor-pointer"
                                                >
                                                    <Bot size={14} className="shrink-0" />
                                                    <span>Return to AI</span>
                                                </button>
                                            )}

                                            <div className="my-1 border-t border-slate-100" />

                                            {activeConversation.conversationStatus === "resolved" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        apiReopenConversation(activeConversation.id);
                                                        setShowCustomerMenu(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-blue-600 hover:bg-blue-50 cursor-pointer"
                                                >
                                                    <RotateCcw size={14} className="shrink-0" />
                                                    <span>Reopen Ticket</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        apiMarkResolved(activeConversation.id);
                                                        setShowCustomerMenu(false);
                                                    }}
                                                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                                >
                                                    <CheckCheck size={14} className="shrink-0" />
                                                    <span>Mark Resolved</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Close Panel Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowCustomerPanel(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                    title="Close Profile Panel"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* SCROLL AREA 3: Customer profile workspace */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                            {/* 1. Profile Header & Avatar */}
                            <div className="relative rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-4 text-center shadow-2xs">
                                <div className="relative mx-auto h-16 w-16">
                                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white font-bold text-xl shadow-sm ring-2 ring-blue-500/20">
                                        {activeConversation.initials || "C"}
                                    </div>
                                    <span
                                        className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${activeConversation.status === "online" ? "bg-emerald-500" : "bg-slate-400"
                                            }`}
                                        title={activeConversation.status === "online" ? "Active Now" : "Offline"}
                                    />
                                </div>

                                <h4 className="mt-3 text-sm font-bold text-slate-900 truncate">
                                    {activeConversation.name}
                                </h4>

                                <div className="mt-1.5 flex items-center justify-center gap-2 flex-wrap">
                                    {/* Channel Badge */}
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200">
                                        <SocialIcon name={activeConversation.channel} size={13} />
                                        <span>{activeConversation.channel || "Website"}</span>
                                    </span>

                                    {/* Online Status Pill */}
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${activeConversation.status === "online"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                        }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${activeConversation.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                        <span>{activeConversation.status === "online" ? "Active Now" : "Offline"}</span>
                                    </span>
                                </div>
                            </div>

                            {/* 2. Professional Commerce Stats Cards */}
                            <div className="grid grid-cols-3 gap-2">
                                {/* Orders Stat Card */}
                                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-center shadow-2xs transition hover:border-emerald-200">
                                    <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-1">
                                        <ShoppingBag size={14} />
                                    </div>
                                    <p className="text-base font-extrabold text-slate-900 leading-tight">
                                        {activeConversation.orders?.length || 0}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                        Orders
                                    </p>
                                </div>

                                {/* Products Stat Card */}
                                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-center shadow-2xs transition hover:border-blue-200">
                                    <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-1">
                                        <Sparkles size={14} />
                                    </div>
                                    <p className="text-base font-extrabold text-slate-900 leading-tight">
                                        {activeConversation.productsDiscussed?.length || 0}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                        Products
                                    </p>
                                </div>

                                {/* Messages Stat Card */}
                                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-center shadow-2xs transition hover:border-purple-200">
                                    <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-1">
                                        <MessageSquare size={14} />
                                    </div>
                                    <p className="text-base font-extrabold text-slate-900 leading-tight">
                                        {activeConversation.messages?.length || 0}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                        Messages
                                    </p>
                                </div>
                            </div>

                            {/* 3. Customer Details Section */}
                            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2.5 text-xs">
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Customer Details
                                </h5>

                                {/* Phone */}
                                {activeConversation.phone && activeConversation.phone !== "—" && (
                                    <div className="flex items-center justify-between text-slate-700">
                                        <div className="flex items-center gap-2 truncate">
                                            <Phone size={13} className="text-slate-400 shrink-0" />
                                            <span className="truncate font-medium">{activeConversation.phone}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(activeConversation.phone);
                                                setCopiedPhone(true);
                                                setTimeout(() => setCopiedPhone(false), 2000);
                                            }}
                                            className="text-[10px] font-semibold text-blue-600 hover:underline shrink-0 cursor-pointer"
                                        >
                                            {copiedPhone ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                )}

                                {/* Email */}
                                {activeConversation.email && activeConversation.email !== "—" && (
                                    <div className="flex items-center gap-2 text-slate-700 truncate">
                                        <Mail size={13} className="text-slate-400 shrink-0" />
                                        <span className="truncate font-medium">{activeConversation.email}</span>
                                    </div>
                                )}

                                {/* Channel */}
                                <div className="flex items-center gap-2 text-slate-700 truncate">
                                    <SocialIcon name={activeConversation.channel} size={13} className="shrink-0" />
                                    <span className="truncate font-medium">{activeConversation.channel || "Website"}</span>
                                </div>

                                {/* Last Active */}
                                {(activeConversation.time || activeConversation.lastActive) && (
                                    <div className="flex items-center gap-2 text-slate-700 truncate">
                                        <Clock3 size={13} className="text-slate-400 shrink-0" />
                                        <span className="truncate text-slate-500">
                                            Last active: <strong className="text-slate-800 font-semibold">{activeConversation.time || activeConversation.lastActive}</strong>
                                        </span>
                                    </div>
                                )}

                                {/* Location */}
                                {activeConversation.location && activeConversation.location !== "—" && (
                                    <div className="flex items-center gap-2 text-slate-700 truncate">
                                        <MapPin size={13} className="text-slate-400 shrink-0" />
                                        <span className="truncate font-medium">{activeConversation.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* 4. Products Discussed Cards */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Products Discussed
                                    </h5>
                                    <span className="rounded-full bg-blue-50 text-blue-600 px-2 py-0.5 text-[10px] font-bold">
                                        {activeConversation.productsDiscussed?.length || 0}
                                    </span>
                                </div>

                                {!activeConversation.productsDiscussed || activeConversation.productsDiscussed.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center">
                                        <ShoppingBag size={20} className="mx-auto text-slate-300 mb-1" />
                                        <p className="text-xs font-medium text-slate-400">
                                            No products discussed yet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {activeConversation.productsDiscussed.map((prod, i) => {
                                            const cProd = catalogMap.get(String(prod).toLowerCase().trim());
                                            return (
                                                <div
                                                    key={i}
                                                    className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-blue-300 transition shadow-2xs"
                                                >
                                                    <div className="h-11 w-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative border border-slate-200/60">
                                                        {cProd?.image ? (
                                                            <img
                                                                src={cProd.image}
                                                                alt={prod}
                                                                className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                                <ShoppingBag size={18} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                                                            {prod}
                                                        </p>
                                                        <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                                                            {cProd?.price ? (
                                                                <span className="font-extrabold text-blue-600">
                                                                    {currency} {Number(cProd.price).toFixed(2)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-slate-400 text-[10px] font-medium">In catalog</span>
                                                            )}
                                                            {cProd?.stock != null && (
                                                                <span className="text-[10px] text-slate-400">
                                                                    • {cProd.stock} in stock
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* 5. Order History Section */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Order History
                                    </h5>
                                    <span className="rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                                        {activeConversation.orders?.length || 0}
                                    </span>
                                </div>

                                {!activeConversation.orders || activeConversation.orders.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center">
                                        <ShoppingBag size={20} className="mx-auto text-slate-300 mb-1" />
                                        <p className="text-xs font-medium text-slate-400">No orders yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {activeConversation.orders.map((ord) => (
                                            <div
                                                key={ord.id}
                                                className="rounded-xl border border-slate-200/80 bg-white p-2.5 space-y-1.5 shadow-2xs"
                                            >
                                                <div className="flex items-start justify-between gap-1">
                                                    <p className="text-xs font-bold text-slate-900 truncate">
                                                        {ord.product || "Order Item"}
                                                    </p>
                                                    <span className="text-xs font-extrabold text-slate-900 shrink-0">
                                                        {ord.amount}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                                    <span>{ord.id}</span>
                                                    <span className="rounded-md bg-emerald-50 text-emerald-700 px-1.5 py-0.5 font-semibold">
                                                        {ord.status || "Completed"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 6. Recent Activity Timeline */}
                            <div className="space-y-2.5 pt-1 border-t border-slate-100">
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Recent Activity
                                </h5>

                                <div className="relative pl-3.5 space-y-3.5 border-l border-slate-200 ml-1.5 text-xs">
                                    {/* Activity Node 1: Latest Message */}
                                    {activeConversation.messages && activeConversation.messages.length > 0 && (
                                        <div className="relative">
                                            <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                                            <p className="font-semibold text-slate-900 leading-tight">
                                                Latest message sent
                                            </p>
                                            <p className="text-[11px] text-slate-500 truncate max-w-[210px] mt-0.5">
                                                "{activeConversation.messages[activeConversation.messages.length - 1]?.text}"
                                            </p>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                                                {activeConversation.messages[activeConversation.messages.length - 1]?.time || activeConversation.time || "Recently"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Activity Node 2: Products Discussed event */}
                                    {activeConversation.productsDiscussed && activeConversation.productsDiscussed.length > 0 && (
                                        <div className="relative">
                                            <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-purple-500 ring-4 ring-white" />
                                            <p className="font-semibold text-slate-900 leading-tight">
                                                Discussed {activeConversation.productsDiscussed.length} product{activeConversation.productsDiscussed.length > 1 ? "s" : ""}
                                            </p>
                                            <p className="text-[11px] text-slate-500 truncate max-w-[210px] mt-0.5">
                                                {activeConversation.productsDiscussed.join(", ")}
                                            </p>
                                        </div>
                                    )}

                                    {/* Activity Node 3: Order History event */}
                                    {activeConversation.orders && activeConversation.orders.length > 0 && (
                                        <div className="relative">
                                            <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                                            <p className="font-semibold text-slate-900 leading-tight">
                                                Placed {activeConversation.orders.length} order{activeConversation.orders.length > 1 ? "s" : ""}
                                            </p>
                                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                                                {activeConversation.orders[0]?.product} ({activeConversation.orders[0]?.amount})
                                            </span>
                                        </div>
                                    )}

                                    {/* Activity Node 4: First Contacted */}
                                    <div className="relative">
                                        <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                                        <p className="font-semibold text-slate-900 leading-tight">
                                            Contacted via {activeConversation.channel || "Website"}
                                        </p>
                                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                                            Conversation initiated
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 7. AI Context & Commerce Insights */}
                            <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-blue-50/40 p-3.5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs">
                                        <Sparkles size={14} className="shrink-0" />
                                        <span>AI Assistant Context</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${activeConversation.mode === "ai"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-amber-100 text-amber-700"
                                        }`}>
                                        {activeConversation.mode === "ai" ? "Autopilot On" : "Human Agent"}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {activeConversation.memory || activeConversation.notes ? (
                                        activeConversation.memory || activeConversation.notes
                                    ) : activeConversation.productsDiscussed && activeConversation.productsDiscussed.length > 0 ? (
                                        `Customer is inquiring about ${activeConversation.productsDiscussed[0]}. AI is configured to provide pricing & catalog details.`
                                    ) : (
                                        "Active conversation ready for automated AI response or live merchant support."
                                    )}
                                </p>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default Inbox;

