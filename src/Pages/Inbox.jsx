import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Phone,
  Video,
  UserRound,
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
  CheckCircle2,
  Zap,
  Circle,
} from "lucide-react";

import { useConversations } from "../hooks/useConversations";
import { useAIChat } from "../hooks/useAIChat";
import { useSettings } from "../hooks/useSettings";

/* =========================================================
   CHANNEL STYLES
========================================================= */

const channelStyles = {
  WhatsApp: {
    badge:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900",
    dot: "bg-emerald-500",
  },

  Instagram: {
    badge:
      "bg-pink-50 text-pink-700 ring-1 ring-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:ring-pink-900",
    dot: "bg-pink-500",
  },

  Facebook: {
    badge:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-900",
    dot: "bg-blue-500",
  },

  Website: {
    badge:
      "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:ring-violet-900",
    dot: "bg-violet-500",
  },
};

/* =========================================================
   MODE STYLES
========================================================= */

const modeStyles = {
  ai: {
    badge:
      "bg-violet-50 text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:ring-violet-900",
  },

  human: {
    badge:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-900",
  },

  handoff: {
    badge:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-900",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const getChannelStyle = (channel) => {
  return (
    channelStyles[channel] || {
      badge:
        "bg-slate-50 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
      dot: "bg-slate-400",
    }
  );
};

const getModeStyle = (mode) => {
  return (
    modeStyles[mode] || {
      badge:
        "bg-slate-50 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
    }
  );
};

/* =========================================================
   COMPONENT
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
  } = useConversations();

  const { sendToAI } = useAIChat();
  const { settings } = useSettings();

  /* =======================================================
     SETTINGS
  ======================================================= */

  const timezone =
    settings?.general?.timezone || "Africa/Accra";

  const aiEnabled =
    settings?.ai?.enabled ?? true;

  const autoReply =
    settings?.ai?.autoReply ?? true;

  const allowCustomerChat =
    settings?.customer?.allowCustomerChat ?? true;

  /* =======================================================
     STATE
  ======================================================= */

  const [selectedId, setSelectedId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showCustomerPanel, setShowCustomerPanel] =
    useState(true);

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [mobileView, setMobileView] =
    useState("list");

  /* =======================================================
     SELECTED CONVERSATION
  ======================================================= */

  const selectedConversation = useMemo(() => {
    return conversations.find(
      (conversation) =>
        conversation.id === selectedId
    );
  }, [conversations, selectedId]);

  /* =======================================================
     NORMALIZED DATA
  ======================================================= */

  const selectedMessages =
    selectedConversation?.messages || [];

  const selectedOrders =
    selectedConversation?.orders || [];

  const selectedProducts =
    selectedConversation?.productsDiscussed || [];

  /* =======================================================
     AUTO SELECT FIRST CONVERSATION
  ======================================================= */

  useEffect(() => {
    if (
      conversations.length > 0 &&
      !selectedId
    ) {
      const firstConversation =
        conversations[0];

      if (firstConversation?.id) {
        setSelectedId(
          firstConversation.id
        );

        selectConversation(
          firstConversation.id
        );
      }
    }
  }, [
    conversations,
    selectedId,
    selectConversation,
  ]);

  /* =======================================================
     FILTER CONVERSATIONS
  ======================================================= */

  const filteredConversations = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return conversations.filter(
      (conversation) => {
        const name =
          conversation?.name || "";

        const lastMessage =
          conversation?.lastMessage || "";

        const channel =
          conversation?.channel || "";

        const matchesSearch =
          !value ||
          name
            .toLowerCase()
            .includes(value) ||
          lastMessage
            .toLowerCase()
            .includes(value) ||
          channel
            .toLowerCase()
            .includes(value);

        let matchesFilter = true;

        if (activeFilter === "Unread") {
          matchesFilter =
            Number(conversation?.unread || 0) >
            0;
        }

        if (activeFilter === "AI") {
          matchesFilter =
            conversation?.mode === "ai";
        }

        if (activeFilter === "Human") {
          matchesFilter =
            conversation?.mode === "human" ||
            conversation?.mode === "handoff";
        }

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    conversations,
    search,
    activeFilter,
  ]);

  /* =======================================================
     SELECT CONVERSATION
  ======================================================= */

  const handleSelectConversation = (id) => {
    if (!id) return;

    setSelectedId(id);
    selectConversation(id);
    setMobileView("chat");
  };

  /* =======================================================
     MOBILE BACK
  ======================================================= */

  const goBackToList = () => {
    setMobileView("list");
  };

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSendMessage = async (event) => {
    event?.preventDefault();

    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      !selectedConversation ||
      !allowCustomerChat
    ) {
      return;
    }

    setMessage("");

    try {
      await apiSendMessage(
        selectedConversation.id,
        trimmedMessage
      );
    } catch (err) {
      console.error(
        "Failed to send message:",
        err
      );

      /*
       * Restore the message if sending fails.
       * This makes retrying easier for the seller.
       */
      setMessage(trimmedMessage);
    }
  };

  /* =======================================================
     TAKE OVER
  ======================================================= */

  const handleTakeOver = async () => {
    if (!selectedId) return;

    try {
      await apiTakeOver(selectedId);
    } catch (err) {
      console.error(
        "Failed to take over:",
        err
      );
    }
  };

  /* =======================================================
     RETURN TO AI
  ======================================================= */

  const handleReturnToAI = async () => {
    if (!selectedId) return;

    try {
      await apiReturnToAI(selectedId);
    } catch (err) {
      console.error(
        "Failed to return to AI:",
        err
      );
    }
  };

  /* =======================================================
     RESOLVE
  ======================================================= */

  const handleMarkResolved = async () => {
    if (!selectedId) return;

    try {
      await apiMarkResolved(selectedId);
    } catch (err) {
      console.error(
        "Failed to mark resolved:",
        err
      );
    }
  };

  /* =======================================================
     REOPEN
  ======================================================= */

  const handleReopenConversation = async () => {
    if (!selectedId) return;

    try {
      await apiReopenConversation(
        selectedId
      );
    } catch (err) {
      console.error(
        "Failed to reopen:",
        err
      );
    }
  };

  /* =======================================================
     AI RESPONSE
  ======================================================= */

  useEffect(() => {
    if (!aiEnabled || !autoReply) {
      return;
    }

    if (
      !selectedConversation ||
      selectedConversation.mode !== "ai" ||
      selectedMessages.length === 0
    ) {
      return;
    }

    const lastIndex =
      selectedMessages.length - 1;

    const lastMessage =
      selectedMessages[lastIndex];

    if (
      !lastMessage ||
      lastMessage.sender !== "customer"
    ) {
      return;
    }

    /*
     * The customer message is the latest message,
     * therefore an AI response cannot already exist
     * after it.
     */
    const conversationHistory =
      selectedMessages
        .slice(-6)
        .map((msg) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          time: msg.time,
        }));

    let cancelled = false;

    sendToAI(
      lastMessage.content,
      selectedConversation.id,
      conversationHistory
    )
      .then((aiResponse) => {
        if (cancelled || !aiResponse) {
          return;
        }

        if (
          aiResponse.requiresHandoff
        ) {
          setConversations((current) =>
            current.map((conv) =>
              conv.id === selectedConversation.id
                ? {
                    ...conv,
                    mode: "handoff",
                    conversationStatus:
                      "handed_off",
                  }
                : conv
            )
          );

          return;
        }

        const responseText =
          aiResponse.response || "";

        if (!responseText) {
          return;
        }

        const aiMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          content: responseText,
          time: new Date().toLocaleTimeString(
            [],
            {
              hour: "numeric",
              minute: "2-digit",
              timeZone: timezone,
            }
          ),
        };

        setConversations((current) =>
          current.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  lastMessage:
                    responseText,
                  time: aiMessage.time,
                  messages: [
                    ...(conv.messages || []),
                    aiMessage,
                  ],
                }
              : conv
          )
        );
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(
            "AI response error:",
            err
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    selectedConversation?.id,
    selectedConversation?.mode,
    selectedMessages,
    aiEnabled,
    autoReply,
    sendToAI,
    setConversations,
    timezone,
  ]);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!selectedConversation) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="px-6 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <MessageSquare
              size={28}
              className="text-violet-500"
            />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No conversation selected
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select a conversation to start chatting.
          </p>
        </div>
      </div>
    );
  }

  const selectedChannelStyle =
    getChannelStyle(
      selectedConversation.channel
    );

  const selectedModeStyle =
    getModeStyle(
      selectedConversation.mode
    );

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-950">

      {/* ===================================================
          LEFT — CONVERSATIONS
      =================================================== */}

      <aside
        className={`
          h-full
          min-h-0
          w-full
          shrink-0
          flex-col
          border-r
          border-slate-200
          bg-white
          dark:border-slate-800
          dark:bg-slate-900

          md:flex
          md:w-[300px]

          lg:w-[320px]

          xl:w-[335px]

          2xl:w-[350px]

          ${
            mobileView === "list"
              ? "flex"
              : "hidden md:flex"
          }
        `}
      >

        {/* LEFT HEADER */}

        <div className="shrink-0 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm shadow-violet-200 dark:shadow-none">
                  <MessageSquare size={15} />
                </div>

                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Inbox
                </h1>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {conversations.length}{" "}
                {conversations.length === 1
                  ? "conversation"
                  : "conversations"}
              </p>
            </div>

            <button
              type="button"
              aria-label="Inbox options"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <MoreHorizontal size={19} />
            </button>
          </div>

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search conversations..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-10
                pr-3
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-violet-300
                focus:bg-white
                focus:ring-4
                focus:ring-violet-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:focus:border-violet-600
                dark:focus:bg-slate-800
                dark:focus:ring-violet-950
              "
            />
          </div>

          {/* FILTERS */}

          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">

            {[
              "All",
              "Unread",
              "AI",
              "Human",
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveFilter(filter)
                }
                className={`
                  shrink-0
                  rounded-lg
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  transition

                  ${
                    activeFilter === filter
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-200 dark:shadow-none"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* CONVERSATION LIST */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

          {loading ? (
            <div className="px-5 py-14 text-center">

              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950">
                <Loader2
                  size={21}
                  className="animate-spin text-violet-500"
                />
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Loading conversations...
              </p>
            </div>
          ) : error ? (
            <div className="px-5 py-14 text-center">

              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40">
                <AlertCircle
                  size={21}
                  className="text-red-500"
                />
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Failed to load conversations
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                {String(error)}
              </p>

              <button
                type="button"
                onClick={refetch}
                className="mt-4 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-400"
              >
                Retry
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-5 py-14 text-center">

              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Search
                  size={20}
                  className="text-slate-400"
                />
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No conversations found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try another search or filter.
              </p>
            </div>
          ) : (
            filteredConversations.map(
              (conversation) => {
                const active =
                  conversation.id ===
                  selectedId;

                const conversationChannel =
                  getChannelStyle(
                    conversation.channel
                  );

                const conversationMode =
                  getModeStyle(
                    conversation.mode
                  );

                const unread =
                  Number(
                    conversation.unread || 0
                  );

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      handleSelectConversation(
                        conversation.id
                      )
                    }
                    className={`
                      group
                      relative
                      w-full
                      border-b
                      border-slate-100
                      px-4
                      py-3.5
                      text-left
                      transition
                      dark:border-slate-800

                      ${
                        active
                          ? "bg-violet-50/70 dark:bg-violet-950/30"
                          : "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70"
                      }
                    `}
                  >

                    {/* ACTIVE INDICATOR */}

                    {active && (
                      <span className="absolute bottom-0 left-0 top-0 w-0.5 bg-violet-600" />
                    )}

                    <div className="flex min-w-0 gap-3">

                      {/* AVATAR */}

                      <div className="relative shrink-0">

                        <div
                          className={`
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            text-xs
                            font-bold
                            shadow-sm

                            ${
                              active
                                ? "bg-violet-600 text-white"
                                : "bg-slate-900 text-white dark:bg-slate-700"
                            }
                          `}
                        >
                          {conversation.initials ||
                            "?"}
                        </div>

                        {conversation.status ===
                          "online" && (
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          </span>
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">

                          <p className="min-w-0 truncate text-sm font-bold text-slate-900 dark:text-white">
                            {conversation.name ||
                              "Unknown customer"}
                          </p>

                          <span className="shrink-0 text-[10px] font-medium text-slate-400">
                            {conversation.time ||
                              ""}
                          </span>
                        </div>

                        {/* CHANNEL + MODE */}

                        <div className="mt-1.5 flex min-w-0 items-center gap-1.5">

                          <span
                            className={`
                              inline-flex
                              shrink-0
                              items-center
                              gap-1
                              rounded-md
                              px-1.5
                              py-0.5
                              text-[9px]
                              font-bold
                              ${conversationChannel.badge}
                            `}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${conversationChannel.dot}`}
                            />

                            {conversation.channel ||
                              "Unknown"}
                          </span>

                          {conversation.mode && (
                            <span
                              className={`
                                inline-flex
                                shrink-0
                                items-center
                                gap-1
                                rounded-md
                                px-1.5
                                py-0.5
                                text-[9px]
                                font-bold
                                ${conversationMode.badge}
                              `}
                            >
                              {conversation.mode ===
                              "ai" ? (
                                <Bot size={9} />
                              ) : conversation.mode ===
                                "handoff" ? (
                                <Clock3 size={9} />
                              ) : (
                                <User size={9} />
                              )}

                              {conversation.mode ===
                              "ai"
                                ? "AI"
                                : conversation.mode ===
                                  "handoff"
                                ? "Handoff"
                                : "Human"}
                            </span>
                          )}
                        </div>

                        {/* LAST MESSAGE */}

                        <div className="mt-2 flex items-center gap-2">

                          <p
                            className={`
                              min-w-0
                              flex-1
                              truncate
                              text-xs

                              ${
                                unread > 0
                                  ? "font-semibold text-slate-800 dark:text-slate-200"
                                  : "text-slate-500 dark:text-slate-400"
                              }
                            `}
                          >
                            {conversation.lastMessage ||
                              "No messages yet"}
                          </p>

                          {unread > 0 && (
                            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              }
            )
          )}
        </div>
      </aside>

      {/* ===================================================
          MIDDLE — CHAT
      =================================================== */}

      <section
        className={`
          h-full
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-slate-50
          dark:bg-slate-950

          ${
            mobileView === "chat"
              ? "flex"
              : "hidden md:flex"
          }
        `}
      >

        {/* =================================================
            CHAT HEADER
        ================================================= */}

        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-5 sm:py-3.5">

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            {/* MOBILE BACK */}

            <button
              type="button"
              onClick={goBackToList}
              aria-label="Back to conversations"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
            >
              <ArrowLeft size={18} />
            </button>

            {/* AVATAR */}

            <div className="relative shrink-0">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-xs font-bold text-white shadow-sm">
                {selectedConversation.initials ||
                  "?"}
              </div>

              {selectedConversation.status ===
                "online" && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
              )}
            </div>

            {/* CUSTOMER */}

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {selectedConversation.name ||
                    "Unknown customer"}
                </h2>

                <span
                  className={`
                    hidden
                    items-center
                    gap-1
                    rounded-md
                    px-1.5
                    py-0.5
                    text-[9px]
                    font-bold
                    sm:inline-flex
                    ${selectedChannelStyle.badge}
                  `}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${selectedChannelStyle.dot}`}
                  />

                  {selectedConversation.channel ||
                    "Unknown"}
                </span>
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400 sm:text-xs">

                <span className="flex items-center gap-1">

                  <Circle
                    size={6}
                    className={
                      selectedConversation.status ===
                      "online"
                        ? "fill-emerald-500 text-emerald-500"
                        : "fill-slate-300 text-slate-300"
                    }
                  />

                  {selectedConversation.status ===
                  "online"
                    ? "Online"
                    : "Offline"}
                </span>

                <span>•</span>

                <span className="capitalize">
                  {(
                    selectedConversation.conversationStatus ||
                    "active"
                  ).replace(
                    /_/g,
                    " "
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex shrink-0 items-center gap-0.5">

            <button
              type="button"
              title="Call"
              aria-label="Call customer"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Phone size={17} />
            </button>

            <button
              type="button"
              title="Video call"
              aria-label="Video call customer"
              className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white sm:block"
            >
              <Video size={17} />
            </button>

            <button
              type="button"
              title="Customer details"
              aria-label="Toggle customer details"
              onClick={() =>
                setShowCustomerPanel(
                  (value) => !value
                )
              }
              className={`
                rounded-xl
                p-2
                transition

                ${
                  showCustomerPanel
                    ? "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                }
              `}
            >
              <PanelRight size={17} />
            </button>

            <button
              type="button"
              title="More options"
              aria-label="More options"
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <MoreHorizontal size={17} />
            </button>
          </div>
        </header>

        {/* =================================================
            AI STATUS BAR
        ================================================= */}

        <div className="shrink-0 border-b border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900 sm:px-5">

          {!aiEnabled ? (
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Bot
                  size={14}
                  className="text-slate-500"
                />
              </span>

              <span>
                AI assistant is disabled
              </span>
            </div>
          ) : !autoReply ? (
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
                <Bot
                  size={14}
                  className="text-violet-500"
                />
              </span>

              <span>
                Automatic replies are disabled
              </span>
            </div>
          ) : selectedConversation.mode ===
            "ai" ? (
            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5">

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
                  <Zap
                    size={14}
                    className="text-violet-600"
                  />
                </span>

                <span className="truncate text-xs text-slate-500 dark:text-slate-400">

                  <strong className="font-bold text-violet-700 dark:text-violet-400">
                    AI is handling
                  </strong>{" "}
                  this conversation
                </span>
              </div>

              {settings?.ai
                ?.humanHandoff !== false && (
                <button
                  type="button"
                  onClick={handleTakeOver}
                  className="shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 dark:shadow-none"
                >
                  Take over
                </button>
              )}
            </div>
          ) : selectedConversation.mode ===
            "human" ? (
            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5">

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                  <User
                    size={14}
                    className="text-blue-600"
                  />
                </span>

                <span className="truncate text-xs text-slate-500 dark:text-slate-400">

                  <strong className="font-bold text-blue-700 dark:text-blue-400">
                    You are handling
                  </strong>{" "}
                  this conversation
                </span>
              </div>

              <button
                type="button"
                onClick={handleReturnToAI}
                className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Return to AI
              </button>
            </div>
          ) : selectedConversation.mode ===
            "handoff" ? (
            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-2.5">

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                  <Clock3
                    size={14}
                    className="text-amber-600"
                  />
                </span>

                <span className="truncate text-xs text-slate-500 dark:text-slate-400">

                  <strong className="font-bold text-amber-700 dark:text-amber-400">
                    Human requested
                  </strong>{" "}
                  — this conversation needs attention.
                </span>
              </div>

              {settings?.ai
                ?.humanHandoff !== false && (
                <button
                  type="button"
                  onClick={handleTakeOver}
                  className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-amber-600"
                >
                  Take over
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* =================================================
            MESSAGE AREA
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 sm:px-5 sm:py-6">

          <div className="mx-auto w-full max-w-3xl space-y-5">

            {/* DATE */}

            <div className="flex justify-center">

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                Today
              </span>
            </div>

            {/* MESSAGES */}

            {selectedMessages.length === 0 ? (
              <div className="py-12 text-center">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
                  <MessageSquare
                    size={20}
                    className="text-slate-300"
                  />
                </div>

                <p className="text-sm font-medium text-slate-500">
                  No messages yet
                </p>
              </div>
            ) : (
              selectedMessages.map(
                (item, index) => {
                  const isCustomer =
                    item.sender ===
                    "customer";

                  const isAI =
                    item.sender === "ai";

                  const isHuman =
                    item.sender === "human";

                  return (
                    <div
                      key={
                        item.id ??
                        `${selectedConversation.id}-${index}`
                      }
                      className={`flex ${
                        isCustomer
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >

                      <div
                        className={`
                          flex
                          max-w-[92%]
                          flex-col
                          sm:max-w-[78%]

                          ${
                            isCustomer
                              ? "items-start"
                              : "items-end"
                          }
                        `}
                      >

                        {/* SENDER */}

                        {!isCustomer && (
                          <div
                            className={`
                              mb-1.5
                              flex
                              items-center
                              gap-1.5
                              text-[10px]
                              font-bold

                              ${
                                isAI
                                  ? "text-violet-500"
                                  : "text-blue-500"
                              }
                            `}
                          >
                            {isAI ? (
                              <>
                                <span className="flex h-4 w-4 items-center justify-center rounded bg-violet-50 dark:bg-violet-950">
                                  <Bot size={9} />
                                </span>

                                AI Assistant
                              </>
                            ) : (
                              <>
                                <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-50 dark:bg-blue-950">
                                  <User size={9} />
                                </span>

                                You
                              </>
                            )}
                          </div>
                        )}

                        {/* MESSAGE */}

                        <div
                          className={`
                            rounded-2xl
                            px-4
                            py-3
                            text-sm
                            leading-6
                            shadow-sm

                            ${
                              isCustomer
                                ? "rounded-tl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                : isAI
                                ? "rounded-tr-md bg-violet-600 text-white shadow-violet-100 dark:shadow-none"
                                : "rounded-tr-md bg-slate-900 text-white dark:bg-slate-700"
                            }
                          `}
                        >
                          {item.content || ""}
                        </div>

                        {/* TIME */}

                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">

                          <span>
                            {item.time || ""}
                          </span>

                          {isHuman && (
                            <CheckCheck
                              size={12}
                              className="text-blue-500"
                            />
                          )}

                          {isAI && (
                            <Sparkles
                              size={10}
                              className="text-violet-400"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            )}

            {/* =================================================
                AI INSIGHT
            ================================================= */}

            {settings?.ai
              ?.productRecommendations !==
              false && (
              <div className="ml-auto w-full max-w-[94%] rounded-2xl border border-violet-100 bg-white p-4 shadow-sm dark:border-violet-900/50 dark:bg-slate-900 sm:max-w-[78%]">

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
                    <Sparkles size={16} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      AI insight
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {selectedProducts.length >
                      0
                        ? `Products discussed: ${selectedProducts.length}`
                        : "No products discussed yet"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/70">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-700">
                      <ShoppingBag
                        size={19}
                        className="text-violet-500"
                      />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                        {selectedProducts[0] ||
                          "No product recommendations yet"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {selectedProducts.length >
                        1
                          ? `+${selectedProducts.length - 1} more discussed`
                          : "Discussed in this conversation"}
                      </p>
                    </div>

                    {settings?.ai
                      ?.orderAssistance !==
                      false &&
                      selectedProducts.length >
                        0 && (
                        <button
                          type="button"
                          className="hidden shrink-0 rounded-lg bg-violet-600 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-violet-700 sm:block"
                        >
                          Create Order
                        </button>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            COMPOSER
        ================================================= */}

        <div className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">

          {/* RESOLVED */}

          {selectedConversation.conversationStatus ===
            "resolved" && (
            <div className="mx-auto mb-3 flex max-w-3xl items-center justify-between gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900 dark:bg-emerald-950/30">

              <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">

                <CheckCircle2 size={14} />

                Conversation resolved
              </div>

              <button
                type="button"
                onClick={
                  handleReopenConversation
                }
                className="text-[11px] font-bold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Reopen
              </button>
            </div>
          )}

          {/* COMPOSER */}

          <form
            onSubmit={handleSendMessage}
            className="mx-auto w-full max-w-3xl"
          >

            <div
              className={`
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition

                focus-within:border-violet-300
                focus-within:ring-4
                focus-within:ring-violet-50

                dark:border-slate-700
                dark:bg-slate-900
                dark:focus-within:border-violet-700
                dark:focus-within:ring-violet-950

                ${
                  !allowCustomerChat
                    ? "opacity-60"
                    : ""
                }
              `}
            >

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    handleSendMessage(event);
                  }
                }}
                rows={2}
                placeholder={
                  !allowCustomerChat
                    ? "Customer chat is disabled"
                    : "Write a message..."
                }
                disabled={
                  !allowCustomerChat
                }
                className="
                  w-full
                  resize-none
                  bg-transparent
                  px-4
                  pt-3.5
                  text-sm
                  text-slate-900
                  outline-none
                  placeholder:text-slate-400
                  dark:text-white
                  disabled:cursor-not-allowed
                "
              />

              <div className="flex items-center justify-between px-2.5 pb-2.5 pt-2">

                <div className="flex items-center gap-1">

                  <button
                    type="button"
                    disabled={
                      !allowCustomerChat
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-violet-600 disabled:cursor-not-allowed dark:hover:bg-slate-800"
                  >
                    <Paperclip size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={
                      !allowCustomerChat
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-violet-600 disabled:cursor-not-allowed dark:hover:bg-slate-800"
                  >
                    <Smile size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2">

                  {selectedConversation.conversationStatus !==
                    "resolved" && (
                    <button
                      type="button"
                      onClick={
                        handleMarkResolved
                      }
                      className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white sm:block sm:text-xs"
                    >
                      Resolve
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={
                      !message.trim() ||
                      !allowCustomerChat ||
                      sendingStates[
                        selectedId
                      ] === "sending"
                    }
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      px-3.5
                      py-2
                      text-[10px]
                      font-bold
                      text-white
                      shadow-sm
                      transition
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      sm:text-xs

                      ${
                        sendingStates[
                          selectedId
                        ] === "sending"
                          ? "bg-amber-500"
                          : sendingStates[
                              selectedId
                            ] === "failed"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-violet-600 hover:bg-violet-700"
                      }
                    `}
                  >

                    {sendingStates[
                      selectedId
                    ] === "sending"
                      ? "Sending..."
                      : sendingStates[
                          selectedId
                        ] === "failed"
                      ? "Failed - Retry"
                      : "Send"}

                    {sendingStates[
                      selectedId
                    ] === "sending" ? (
                      <Loader2
                        size={13}
                        className="animate-spin"
                      />
                    ) : sendingStates[
                        selectedId
                      ] === "failed" ? (
                      <RotateCcw size={13} />
                    ) : (
                      <Send size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-2 hidden text-center text-[10px] font-medium text-slate-400 sm:block">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </form>
        </div>
      </section>

      {/* ===================================================
          RIGHT — CUSTOMER DETAILS
      =================================================== */}

      {showCustomerPanel && (
        <aside className="hidden h-full min-h-0 w-[285px] shrink-0 flex-col border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 xl:flex 2xl:w-[320px]">

          {/* HEADER */}

          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

            <div className="min-w-0">

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Customer details
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Customer profile
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowCustomerPanel(false)
              }
              aria-label="Close customer details"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* DETAILS */}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

            {/* PROFILE */}

            <div className="border-b border-slate-100 px-5 py-6 text-center dark:border-slate-800">

              <div className="relative mx-auto w-fit">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-violet-100 dark:shadow-none">
                  {selectedConversation.initials ||
                    "?"}
                </div>

                <span
                  className={`
                    absolute
                    -bottom-1
                    -right-1
                    h-5
                    w-5
                    rounded-full
                    border-4
                    border-white
                    dark:border-slate-900

                    ${
                      selectedConversation.status ===
                      "online"
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }
                  `}
                />
              </div>

              <h4 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                {selectedConversation.name ||
                  "Unknown customer"}
              </h4>

              <p className="mt-1 text-xs text-slate-400">
                {selectedConversation.status ===
                "online"
                  ? "Active now"
                  : "Offline"}
              </p>

              {/* CONTACT */}

              <div className="mt-5 space-y-2 text-left">

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800">

                  <Phone
                    size={14}
                    className="shrink-0 text-violet-500"
                  />

                  <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                    {selectedConversation.phone ||
                      "No phone number"}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800">

                  <Mail
                    size={14}
                    className="shrink-0 text-blue-500"
                  />

                  <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                    {selectedConversation.email ||
                      "No email"}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800">

                  <MapPin
                    size={14}
                    className="shrink-0 text-emerald-500"
                  />

                  <span className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                    {selectedConversation.location ||
                      "No location"}
                  </span>
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-800">

              <div className="border-r border-slate-100 px-4 py-4 text-center dark:border-slate-800">

                <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
                  <ShoppingBag
                    size={13}
                    className="text-blue-500"
                  />
                </div>

                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedOrders.length}
                </p>

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Orders
                </p>
              </div>

              <div className="px-4 py-4 text-center">

                <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
                  <Sparkles
                    size={13}
                    className="text-violet-500"
                  />
                </div>

                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedProducts.length}
                </p>

                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Products
                </p>
              </div>
            </div>

            {/* ORDERS */}

            <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">

              <div className="mb-3 flex items-center justify-between">

                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Orders
                </h4>

                <ChevronDown
                  size={14}
                  className="text-slate-400"
                />
              </div>

              {selectedOrders.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center dark:border-slate-700 dark:bg-slate-800/50">

                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-700">
                    <ShoppingBag
                      size={16}
                      className="text-slate-300"
                    />
                  </div>

                  <p className="text-xs font-medium text-slate-400">
                    No orders yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">

                  {selectedOrders.map(
                    (order, index) => (
                      <div
                        key={
                          order.id ??
                          `order-${index}`
                        }
                        className="rounded-xl border border-slate-200 bg-white p-3 transition hover:border-violet-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800"
                      >

                        <div className="flex items-start justify-between gap-2">

                          <div className="min-w-0">

                            <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                              {order.product ||
                                "Order"}
                            </p>

                            <p className="mt-1 text-[10px] font-medium text-slate-400">
                              {order.id ||
                                "Order ID unavailable"}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs font-bold text-slate-900 dark:text-white">
                            {order.amount ||
                              ""}
                          </span>
                        </div>

                        <div className="mt-3">

                          <span
                            className={`
                              inline-flex
                              rounded-md
                              px-2
                              py-1
                              text-[9px]
                              font-bold

                              ${
                                order.status ===
                                "Completed"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              }
                            `}
                          >
                            {order.status ||
                              "Pending"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* PRODUCTS */}

            <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">

              <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Products discussed
              </h4>

              {selectedProducts.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center dark:border-slate-700 dark:bg-slate-800/50">

                  <ShoppingBag
                    size={17}
                    className="mx-auto mb-2 text-slate-300"
                  />

                  <p className="text-xs font-medium text-slate-400">
                    No products discussed
                  </p>
                </div>
              ) : (
                <div className="space-y-2">

                  {selectedProducts.map(
                    (product, index) => (
                      <div
                        key={`${product}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800"
                      >

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-700">
                          <ShoppingBag
                            size={14}
                            className="text-violet-500"
                          />
                        </div>

                        <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {product}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* NOTES */}

            <div className="px-5 py-5">

              <div className="mb-3 flex items-center justify-between">

                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Notes
                </h4>

                <button
                  type="button"
                  className="rounded-md px-2 py-1 text-[10px] font-bold text-violet-600 transition hover:bg-violet-50 dark:hover:bg-violet-950"
                >
                  + Add
                </button>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center dark:border-slate-700 dark:bg-slate-800/50">

                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-700">
                  <UserRound
                    size={16}
                    className="text-slate-300"
                  />
                </div>

                <p className="text-xs leading-5 text-slate-400">
                  Add notes about this customer.
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Inbox;
