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
} from "lucide-react";

import { useConversations } from "../hooks/useConversations";
import { useAIChat } from "../hooks/useAIChat";
import { useSettings } from "../hooks/useSettings";

/* =========================================================
   CHANNEL STYLES
========================================================= */

const channelStyles = {
  WhatsApp: "bg-green-50 text-green-700",
  Instagram: "bg-pink-50 text-pink-700",
  Facebook: "bg-blue-50 text-blue-700",
  Website: "bg-gray-100 text-gray-700",
};

/* =========================================================
   COMPONENT
========================================================= */

const Inbox = () => {
  const {
    conversations,
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
  } = useConversations();

  const { sendToAI, loading: aiLoading } = useAIChat();
  const { settings } = useSettings();
  const currency = settings?.general?.currency || "GHS";
  const timezone = settings?.general?.timezone || "Africa/Accra";
  const aiEnabled = settings?.ai?.enabled ?? true;
  const autoReply = settings?.ai?.autoReply ?? true;

  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  const [showCustomerPanel, setShowCustomerPanel] =
    useState(true);

  const [activeFilter, setActiveFilter] =
    useState("All");

  /*
    MOBILE VIEW

    list = conversation list
    chat = active conversation
  */
  const [mobileView, setMobileView] =
    useState("list");

  /* =======================================================
     SELECTED CONVERSATION
  ======================================================= */

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.id === selectedId
    );

  // Auto-select first conversation when loaded
  useEffect(() => {
    if (conversations.length > 0 && !selectedId) {
      const firstId = conversations[0].id;
      setSelectedId(firstId);
      selectConversation(firstId);
    }
  }, [conversations, selectedId, selectConversation]);

  /* =======================================================
     FILTER CONVERSATIONS
  ======================================================= */

  const filteredConversations = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return conversations.filter(
      (conversation) => {
        const matchesSearch =
          !value ||
          conversation.name
            .toLowerCase()
            .includes(value) ||
          conversation.lastMessage
            .toLowerCase()
            .includes(value) ||
          conversation.channel
            .toLowerCase()
            .includes(value);

        let matchesFilter = true;

        if (activeFilter === "Unread") {
          matchesFilter =
            conversation.unread > 0;
        }

        if (activeFilter === "AI") {
          matchesFilter =
            conversation.mode === "ai";
        }

        if (activeFilter === "Human") {
          matchesFilter =
            conversation.mode === "human" ||
            conversation.mode === "handoff";
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
    setSelectedId(id);
    selectConversation(id);

    /*
      On mobile, move from list to chat
    */
    setMobileView("chat");
  };

  /* =======================================================
     GO BACK TO LIST ON MOBILE
  ======================================================= */

  const goBackToList = () => {
    setMobileView("list");
  };

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || !selectedConversation) {
      return;
    }

    setMessage("");

    try {
      await apiSendMessage(selectedConversation.id, trimmedMessage);
    } catch (err) {
      console.error('Failed to send message:', err);
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
      console.error('Failed to take over:', err);
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
      console.error('Failed to return to AI:', err);
    }
  };

  /* =======================================================
     MARK RESOLVED
  ======================================================= */

  const handleMarkResolved = async () => {
    if (!selectedId) return;
    try {
      await apiMarkResolved(selectedId);
    } catch (err) {
      console.error('Failed to mark resolved:', err);
    }
  };

  /* =======================================================
     REOPEN
  ======================================================= */

  const handleReopenConversation = async () => {
    if (!selectedId) return;
    try {
      await apiReopenConversation(selectedId);
    } catch (err) {
      console.error('Failed to reopen:', err);
    }
  };

  /* =======================================================
     AI RESPONSE HANDLING
  ======================================================= */

  // Trigger AI response when conversation is in AI mode and last message is from customer - respects AI settings
  useEffect(() => {
    // Respect Enable AI and Automatic replies - single source of truth is settings.ai
    if (!aiEnabled || !autoReply) return;
    if (
      selectedConversation &&
      selectedConversation.mode === 'ai' &&
      selectedConversation.messages.length > 0
    ) {
      const lastMessage = selectedConversation.messages[selectedConversation.messages.length - 1];
      // Check if last message is from customer and we haven't responded yet
      if (lastMessage.sender === 'customer') {
        // Check if there's already an AI response after this customer message
        const hasAIResponse = selectedConversation.messages.some(
          (msg, idx) => msg.sender === 'ai' && idx > selectedConversation.messages.indexOf(lastMessage)
        );
        
        if (!hasAIResponse) {
          // Trigger AI response
          const conversationHistory = selectedConversation.messages.slice(-6).map(msg => ({
            id: msg.id,
            sender: msg.sender,
            content: msg.content,
            time: msg.time,
          }));
          
          sendToAI(lastMessage.content, selectedConversation.id, conversationHistory)
            .then((aiResponse) => {
              if (aiResponse.requiresHandoff) {
                // AI requested handoff - update conversation mode
                setConversations((current) =>
                  current.map((conv) =>
                    conv.id === selectedId
                      ? {
                          ...conv,
                          mode: 'handoff',
                          conversationStatus: 'handed_off',
                        }
                      : conv
                  )
                );
              } else {
                // Add AI response to conversation
                const aiMessage = {
                  id: Date.now(),
                  sender: 'ai',
                  content: aiResponse.response,
                  time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: timezone }),
                };
                
                setConversations((current) =>
                  current.map((conv) =>
                    conv.id === selectedId
                      ? {
                          ...conv,
                          lastMessage: aiResponse.response,
                          time: aiMessage.time,
                          messages: [...conv.messages, aiMessage],
                        }
                      : conv
                  )
                );
              }
            })
            .catch((err) => {
              console.error('AI response error:', err);
            });
        }
      }
    }
  }, [selectedConversation?.messages, selectedConversation?.mode, selectedId, sendToAI, aiEnabled, autoReply]);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!selectedConversation) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <MessageSquare
            className="mx-auto mb-3 text-gray-400"
            size={32}
          />

          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No conversation selected
          </h2>
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
        flex
        h-full
        min-h-0
        w-full
        min-w-0
        overflow-hidden
        bg-gray-50
      "
    >
      {/* ===================================================
          LEFT — CONVERSATION LIST

          MOBILE:
          flex when mobileView === list

          DESKTOP:
          always flex from md upwards
      ==================================================== */}

      <aside
        className={`
          h-full
          min-h-0
          w-full
          shrink-0
          flex-col
          border-r
          border-gray-200
          bg-white

          md:flex
          md:w-[290px]

          lg:w-[300px]

          xl:w-[320px]

          2xl:w-[340px]

          ${
            mobileView === "list"
              ? "flex"
              : "hidden md:flex"
          }
        `}
      >
        {/* HEADER */}
        <div
          className="
            shrink-0
            border-b
            border-gray-200
            bg-white
            px-3
            py-3
            sm:px-4
            sm:py-4
          "
        >
          {/* Title */}
          <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
                Inbox
              </h1>

              <p className="text-[11px] text-gray-500 sm:text-xs">
                {conversations.length}{" "}
                conversations
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-900 dark:text-gray-100"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={16}
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
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search conversations"
              className="
                h-10
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                pl-9
                pr-3
                text-xs
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-gray-300
                focus:bg-white
                focus:ring-1
                focus:ring-gray-200
                sm:text-sm
              "
            />
          </div>

          {/* Filters */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
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
                  rounded-full
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  transition
                  sm:text-xs

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

        {/* LIST ONLY SCROLLS */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
          "
        >
          {loading ? (
            <div className="px-5 py-12 text-center">
              <Loader2
                className="mx-auto mb-3 text-gray-300 animate-spin"
                size={28}
              />
              <p className="text-sm font-medium text-gray-700">
                Loading conversations...
              </p>
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <AlertCircle
                className="mx-auto mb-3 text-red-400"
                size={28}
              />
              <p className="text-sm font-medium text-gray-700">
                Failed to load conversations
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {error}
              </p>
              <button
                onClick={refetch}
                className="mt-3 text-xs font-medium text-blue-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Search
                className="mx-auto mb-3 text-gray-300"
                size={28}
              />

              <p className="text-sm font-medium text-gray-700">
                No conversations found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Try another search or filter.
              </p>
            </div>
          ) : (
            filteredConversations.map(
              (conversation) => {
                const active =
                  conversation.id ===
                  selectedId;

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
                      w-full
                      border-b
                      border-gray-100
                      px-3
                      py-3
                      text-left
                      transition
                      sm:px-4
                      sm:py-4

                      ${
                        active
                          ? "bg-gray-50"
                          : "bg-white hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex min-w-0 gap-3">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-gray-900
                            text-[11px]
                            font-semibold
                            text-white
                            sm:h-11
                            sm:w-11
                            sm:text-xs
                          "
                        >
                          {
                            conversation.initials
                          }
                        </div>

                        {conversation.status ===
                          "online" && (
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

                      {/* Conversation details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {
                              conversation.name
                            }
                          </p>

                          <span className="shrink-0 text-[10px] text-gray-400">
                            {
                              conversation.time
                            }
                          </span>
                        </div>

                        {/* Channel / mode */}
                        <div className="mt-1 flex min-w-0 items-center gap-1.5">
                          <span
                            className={`
                              shrink-0
                              rounded
                              px-1.5
                              py-0.5
                              text-[9px]
                              font-medium
                              sm:text-[10px]
                              ${
                                channelStyles[
                                  conversation
                                    .channel
                                ]
                              }
                            `}
                          >
                            {
                              conversation.channel
                            }
                          </span>

                          {conversation.mode ===
                            "ai" && (
                            <span className="flex shrink-0 items-center gap-1 text-[9px] text-gray-400 sm:text-[10px]">
                              <Bot size={10} />
                              AI
                            </span>
                          )}

                          {conversation.mode ===
                            "human" && (
                            <span className="flex shrink-0 items-center gap-1 text-[9px] text-gray-400 sm:text-[10px]">
                              <User size={10} />
                              Human
                            </span>
                          )}

                          {conversation.mode ===
                            "handoff" && (
                            <span className="flex shrink-0 items-center gap-1 text-[9px] text-amber-600 sm:text-[10px]">
                              <User size={10} />
                              Handoff
                            </span>
                          )}
                        </div>

                        {/* Last message */}
                        <div className="mt-2 flex items-center gap-2">
                          <p
                            className={`
                              min-w-0
                              flex-1
                              truncate
                              text-xs
                              ${
                                conversation.unread >
                                0
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500"
                              }
                            `}
                          >
                            {
                              conversation.lastMessage
                            }
                          </p>

                          {conversation.unread >
                            0 && (
                            <span
                              className="
                                flex
                                h-5
                                min-w-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-gray-900
                                px-1.5
                                text-[10px]
                                font-semibold
                                text-white
                              "
                            >
                              {
                                conversation.unread
                              }
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

          MOBILE:
          full width when mobileView === chat

          DESKTOP:
          always visible
      ==================================================== */}

      <section
        className={`
          h-full
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          bg-gray-50

          ${
            mobileView === "chat"
              ? "flex"
              : "hidden md:flex"
          }
        `}
      >
        {/* =================================================
            CHAT HEADER
        ================================================== */}

        <header
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            px-3
            py-3
            sm:px-5
            sm:py-4
          "
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* MOBILE BACK */}
            <button
              type="button"
              onClick={goBackToList}
              className="
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900

                md:hidden
              "
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-900
                  text-[10px]
                  font-semibold
                  text-white
                  sm:h-10
                  sm:w-10
                  sm:text-xs
                "
              >
                {
                  selectedConversation.initials
                }
              </div>

              {selectedConversation.status ===
                "online" && (
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

            {/* Customer info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {
                    selectedConversation.name
                  }
                </h2>

                <span
                  className={`
                    hidden
                    rounded
                    px-1.5
                    py-0.5
                    text-[10px]
                    font-medium
                    sm:inline-block
                    ${
                      channelStyles[
                        selectedConversation
                          .channel
                      ]
                    }
                  `}
                >
                  {
                    selectedConversation.channel
                  }
                </span>
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400 sm:text-xs">
                <span>
                  {selectedConversation.status ===
                  "online"
                    ? "Online"
                    : "Offline"}
                </span>

                <span>•</span>

                <span className="capitalize">
                  {selectedConversation.conversationStatus.replace(
                    "_",
                    " "
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Chat actions */}
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              title="Call"
              className="
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
              "
            >
              <Phone size={17} />
            </button>

            <button
              type="button"
              title="Video call"
              className="
                hidden
                rounded-lg
                p-2
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-900
                sm:block
              "
            >
              <Video size={17} />
            </button>

            <button
              type="button"
              title="Customer details"
              onClick={() =>
                setShowCustomerPanel(
                  (value) => !value
                )
              }
              className={`
                rounded-lg
                p-2
                transition
                ${
                  showCustomerPanel
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <PanelRight size={17} />
            </button>

            <button
              type="button"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-900 dark:text-gray-100"
            >
              <MoreHorizontal size={17} />
            </button>
          </div>
        </header>

        {/* =================================================
            AI STATUS
        ================================================== */}

        <div className="shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 sm:px-5">
          {!aiEnabled ? (
            <div className="flex items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Bot size={13} className="text-gray-400" />
              </span>
              <span>AI assistant is disabled</span>
            </div>
          ) : !autoReply ? (
            <div className="flex items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Bot size={13} className="text-gray-400" />
              </span>
              <span>Automatic replies are disabled</span>
            </div>
          ) : selectedConversation.mode ===
            "ai" && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 text-[11px] text-gray-600 sm:text-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Bot
                    size={13}
                    className="text-gray-700"
                  />
                </span>

                <span className="truncate">
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    AI is handling
                  </strong>{" "}
                  this conversation
                </span>
              </div>

              {settings?.ai?.humanHandoff !== false && (
              <button
                type="button"
                onClick={handleTakeOver}
                className="
                  shrink-0
                  rounded-lg
                  border
                  border-gray-200
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  sm:px-3
                  sm:text-xs
                "
              >
                Take over
              </button>
              )}
            </div>
          )}

          {selectedConversation.mode ===
            "human" && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 text-[11px] text-gray-600 sm:text-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <User
                    size={13}
                    className="text-gray-700"
                  />
                </span>

                <span className="truncate">
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    You are handling
                  </strong>{" "}
                  this conversation
                </span>
              </div>

              <button
                type="button"
                onClick={handleReturnToAI}
                className="
                  shrink-0
                  rounded-lg
                  border
                  border-gray-200
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  sm:px-3
                  sm:text-xs
                "
              >
                Return to AI
              </button>
            </div>
          )}

          {selectedConversation.mode ===
            "handoff" && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 text-[11px] text-gray-600 sm:text-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50">
                  <Clock3
                    size={13}
                    className="text-amber-600"
                  />
                </span>

                <span className="truncate">
                  <strong className="font-semibold text-gray-900 dark:text-gray-100">
                    Human requested
                  </strong>{" "}
                  — this conversation needs attention.
                </span>
              </div>

              {settings?.ai?.humanHandoff !== false && (
              <button
                type="button"
                onClick={handleTakeOver}
                className="
                  shrink-0
                  rounded-lg
                  bg-gray-900
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-medium
                  text-white
                  transition
                  hover:bg-gray-800
                  sm:px-3
                  sm:text-xs
                "
              >
                Take over
                </button>
                )}
              </div>
          )}
          </div>

        {/* =================================================
            MESSAGE COMPOSER — FIXED
        ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-3
            py-4
            sm:px-5
            sm:py-6
          "
        >
          <div className="mx-auto w-full max-w-3xl space-y-5">
            {/* Date */}
            <div className="flex justify-center">
              <span className="rounded-full bg-white dark:bg-gray-900 px-3 py-1 text-[10px] font-medium text-gray-400 shadow-sm">
                Today
              </span>
            </div>

            {/* Messages */}
            {selectedConversation.messages.map(
              (item) => {
                const isCustomer =
                  item.sender ===
                  "customer";

                const isAI =
                  item.sender === "ai";

                const isHuman =
                  item.sender === "human";

                return (
                  <div
                    key={item.id}
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
                      {!isCustomer && (
                        <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-gray-400">
                          {isAI ? (
                            <>
                              <Bot size={11} />
                              AI
                            </>
                          ) : (
                            <>
                              <User size={11} />
                              You
                            </>
                          )}
                        </div>
                      )}

                      <div
                        className={`
                          rounded-2xl
                          px-3.5
                          py-2.5
                          text-xs
                          leading-6
                          sm:px-4
                          sm:py-3
                          sm:text-sm
                          ${
                            isCustomer
                              ? "rounded-tl-md bg-white text-gray-800 shadow-sm"
                              : "rounded-tr-md bg-gray-900 text-white"
                          }
                        `}
                      >
                        {item.content}
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                        <span>
                          {item.time}
                        </span>

                        {isHuman && (
                          <CheckCheck
                            size={11}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {/* =================================================
                AI INSIGHT - respects Product recommendations setting
            ================================================== */}

            {settings?.ai?.productRecommendations !== false && (
            <div className="ml-auto w-full max-w-[94%] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm sm:max-w-[78%] sm:p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Sparkles
                    size={14}
                    className="text-gray-700"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    AI insight
                  </p>

                  <p className="text-[10px] text-gray-400">
                    Purchase intent detected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-200 sm:h-12 sm:w-12">
                  <ShoppingBag
                    size={17}
                    className="text-gray-500"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                    Black Evening Dress
                  </p>

                  <p className="text-[10px] text-gray-500 sm:text-xs">
                    {currency} 450 • Size M
                  </p>
                </div>

                {settings?.ai?.orderAssistance !== false && (
                <button
                  type="button"
                  className="
                    hidden
                    shrink-0
                    rounded-lg
                    bg-gray-900
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    text-white
                    sm:block
                  "
                >
                  Create Order
                </button>
                )}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* =================================================
            MESSAGE COMPOSER — FIXED
        ================================================== */}

        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-4">
          {selectedConversation.conversationStatus ===
            "resolved" && (
            <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2.5">
              <div className="flex items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                <CheckCheck size={14} />

                Conversation resolved
              </div>

              <button
                type="button"
                onClick={handleReopenConversation}
                className="shrink-0 text-[11px] font-medium text-gray-900 dark:text-gray-100 hover:underline sm:text-xs"
              >
                Reopen
              </button>
            </div>
          )}

          <form
            onSubmit={handleSendMessage}
            className="mx-auto w-full max-w-3xl"
          >
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
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
                placeholder="Type a message..."
                className="
                  w-full
                  resize-none
                  bg-transparent
                  px-3
                  pt-3
                  text-xs
                  text-gray-900
                  outline-none
                  placeholder:text-gray-400
                  sm:px-4
                  sm:text-sm
                "
              />

              <div className="flex items-center justify-between px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-700"
                  >
                    <Paperclip size={16} />
                  </button>

                  <button
                    type="button"
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 dark:bg-gray-800 hover:text-gray-700"
                  >
                    <Smile size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedConversation.conversationStatus !==
                    "resolved" && (
                    <button
                      type="button"
                      onClick={handleMarkResolved}
                      className="
                        hidden
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-2
                        text-[10px]
                        font-medium
                        text-gray-600
                        transition
                        hover:bg-gray-50
                        hover:text-gray-900
                        sm:block
                        sm:text-xs
                      "
                    >
                      Resolve
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={
                      !message.trim()
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-gray-900
                      px-3
                      py-2
                      text-[10px]
                      font-medium
                      text-white
                      transition
                      hover:bg-gray-800
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                      sm:text-xs
                    "
                  >
                    <span>Send</span>

                    <Send size={13} />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-2 hidden text-center text-[10px] text-gray-400 sm:block">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </form>
        </div>
      </section>

      {/* ===================================================
          RIGHT — CUSTOMER DETAILS

          Hidden below xl
      ==================================================== */}

      {showCustomerPanel && (
        <aside
          className="
            hidden
            h-full
            min-h-0
            w-[270px]
            shrink-0
            flex-col
            border-l
            border-gray-200
            bg-white

            xl:flex

            2xl:w-[320px]
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              border-b
              border-gray-200
              px-4
              py-4
            "
          >
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                Customer details
              </h3>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Customer profile
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowCustomerPanel(
                  false
                )
              }
              className="
                rounded-lg
                p-2
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-700
              "
            >
              <X size={16} />
            </button>
          </div>

          {/* DETAILS — ONLY THIS SCROLLS */}
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
            "
          >
            {/* PROFILE */}
            <div className="border-b border-gray-100 px-5 py-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                {
                  selectedConversation.initials
                }
              </div>

              <h4 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {
                  selectedConversation.name
                }
              </h4>

              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <span
                  className={`
                    h-2
                    w-2
                    rounded-full
                    ${
                      selectedConversation.status ===
                      "online"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }
                  `}
                />

                {selectedConversation.status ===
                "online"
                  ? "Online"
                  : "Offline"}
              </div>

              <div className="mt-4 space-y-2 text-left">
                <div className="flex min-w-0 items-center gap-2 text-xs text-gray-500">
                  <Phone
                    size={14}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {
                      selectedConversation.phone
                    }
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-xs text-gray-500">
                  <Mail
                    size={14}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {
                      selectedConversation.email
                    }
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-xs text-gray-500">
                  <MapPin
                    size={14}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {
                      selectedConversation.location
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 border-b border-gray-100">
              <div className="border-r border-gray-100 px-4 py-4 text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {
                    selectedConversation
                      .orders.length
                  }
                </p>

                <p className="text-[11px] text-gray-400">
                  Orders
                </p>
              </div>

              <div className="px-4 py-4 text-center">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {
                    selectedConversation
                      .productsDiscussed
                      .length
                  }
                </p>

                <p className="text-[11px] text-gray-400">
                  Products
                </p>
              </div>
            </div>

            {/* ORDERS */}
            <div className="border-b border-gray-100 px-5 py-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Orders
                </h4>

                <ChevronDown
                  size={14}
                  className="text-gray-400"
                />
              </div>

              {selectedConversation.orders
                .length === 0 ? (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-4 text-center">
                  <ShoppingBag
                    size={18}
                    className="mx-auto mb-2 text-gray-300"
                  />

                  <p className="text-xs text-gray-400">
                    No orders yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedConversation.orders.map(
                    (order) => (
                      <div
                        key={order.id}
                        className="rounded-lg border border-gray-100 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                              {
                                order.product
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              {order.id}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs font-semibold text-gray-900 dark:text-gray-100">
                            {
                              order.amount
                            }
                          </span>
                        </div>

                        <div className="mt-2">
                          <span
                            className={`
                              rounded
                              px-1.5
                              py-1
                              text-[10px]
                              font-medium
                              ${
                                order.status ===
                                "Completed"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-amber-50 text-amber-700"
                              }
                            `}
                          >
                            {
                              order.status
                            }
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* PRODUCTS */}
            <div className="border-b border-gray-100 px-5 py-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Products discussed
              </h4>

              <div className="space-y-2">
                {selectedConversation.productsDiscussed.map(
                  (product) => (
                    <div
                      key={product}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-200">
                        <ShoppingBag
                          size={15}
                          className="text-gray-500"
                        />
                      </div>

                      <p className="truncate text-xs font-medium text-gray-700">
                        {product}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* NOTES */}
            <div className="px-5 py-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Notes
                </h4>

                <button
                  type="button"
                  className="text-[10px] font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-100"
                >
                  + Add
                </button>
              </div>

              <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 px-3 py-4 text-center">
                <UserRound
                  size={18}
                  className="mx-auto mb-2 text-gray-300"
                />

                <p className="text-xs leading-5 text-gray-400">
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