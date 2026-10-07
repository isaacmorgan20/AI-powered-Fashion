import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bell, Search, Menu, X, Bot, Circle, Wifi, WifiOff, ChevronRight, User, ShoppingBag, Package, MessageSquare, ExternalLink, CheckCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Button, Badge, Input } from "../ui";
import useAuthStore from "../../Store/AuthStore";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { useNotifications } from "../../hooks/useNotifications";
import { api } from "../../service/api";

const TopBar = ({ sidebarOpen, onMobileMenuOpen }) => {
  const { user, logout } = useAuthStore();
  const { isOnline, showReconnected } = useOnlineStatus();
  const navigate = useNavigate();
  const {
    events: notifications,
    loading,
    unreadCount,
    refetch,
    markAllRead,
    requestNotificationPermission,
    handleNotificationClick,
    notificationSettings
  } = useNotifications(navigate);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const formatTime = useCallback((ts) => {
    const now = Date.now();
    const ms = (typeof ts === 'object' && ts?.toDate) ? ts.toDate().getTime()
      : (typeof ts === 'object' && typeof ts.seconds === 'number') ? ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6)
        : (typeof ts === 'number') ? ts
          : now;
    const date = new Date(ms);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const data = await api.search.global(query.trim(), 10);
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 200),
    []);

  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setSearchOpen(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay to allow click on result
    setTimeout(() => setSearchOpen(false), 150);
  };

  const handleResultClick = (result) => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
    if (result.url) {
      window.location.href = result.url;
    }
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userRole = "Administrator";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`
 sticky top-0 z-30 h-16 shrink-0 
 border-b border-border-light
 bg-surface-primary/95 backdrop-blur-sm
 transition-all duration-300
 ${sidebarOpen ? "" : ""}
 `}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* =====================================================
 LEFT: Mobile menu + Search
 ====================================================== */}
        <div className="flex items-center gap-9">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuOpen}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2} />
          </Button>

          {/* Search */}
          <div className="hidden sm:block relative w-72 lg:w-96" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search conversations, products, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="pl-10 h-8 text-sm focus:border-primary "
              aria-label="Search"
              aria-expanded={searchOpen && searchResults.length > 0}
              aria-controls="search-results"
            />
            {(searchOpen || searchLoading) && searchResults.length > 0 && (
              <div
                id="search-results"
                className="absolute left-0 right-0 top-full mt-1 w-full origin-top-center rounded-xl border border-border-light bg-surface-primary shadow-lg animate-slideDown z-50 max-h-96 overflow-y-auto"
                role="listbox"
              >
                {searchLoading && (
                  <div className="p-4 text-center text-sm text-text-muted">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                    <p className="mt-2">Searching...</p>
                  </div>
                )}
                {!searchLoading && searchResults.length === 0 && (
                  <div className="p-4 text-center text-sm text-text-muted">
                    <Search className="mx-auto h-8 w-8 text-text-muted" />
                    <p className="mt-2">No results for "{searchQuery}"</p>
                  </div>
                )}
                {!searchLoading && searchResults.length > 0 && (
                  <ul className="divide-y divide-border-light" role="listbox">
                    {searchResults.map((result, index) => (
                      <li
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        onKeyDown={(e) => e.key === "Enter" && handleResultClick(result)}
                        tabIndex={0}
                        role="option"
                        className="px-4 py-2.5 hover:bg-surface-muted cursor-pointer transition-colors flex items-center gap-3"
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${result.type === "conversation" ? "bg-primary/10 text-primary" : result.type === "customer" ? "bg-success/10 text-success" : result.type === "product" ? "bg-warning/10 text-warning" : "bg-error/10 text-error"}`}>
                          {result.type === "conversation" && <MessageSquare size={16} />}
                          {result.type === "customer" && <User size={16} />}
                          {result.type === "product" && <Package size={16} />}
                          {result.type === "order" && <ShoppingBag size={16} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary truncate">{result.title}</p>
                          <p className="mt-0.5 text-[11px] text-text-muted truncate flex items-center gap-2">
                            <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-muted">
                              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                            </span>
                            <span>{result.subtitle}</span>
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-text-muted" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
 RIGHT: Notifications, AI status, Connection status, User menu
 ====================================================== */}
        <div className="flex items-center gap-2">
          {/* Connection Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5">
            {!isOnline && (
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <WifiOff size={12} />
                <span>Offline — showing saved data</span>
              </div>
            )}
            {showReconnected && (
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700 animate-fadeIn">
                <Wifi size={12} />
                <span>Back online</span>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
              aria-expanded={notificationsOpen}
              aria-haspopup="true"
              className="relative"
            >
              <Bell size={20} strokeWidth={2} className="text-text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-surface-primary bg-error px-1 text-[10px] font-bold text-error-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>

            {notificationsOpen && (
              <>
                {/* Backdrop for mobile - closes on click outside */}
                <div
                  className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fadeIn"
                  onClick={() => setNotificationsOpen(false)}
                  aria-hidden="true"
                />

                {/* Notification Panel - Responsive positioning */}
                <div
                  className={`
        fixed right-4 top-16 z-50 w-full max-w-sm origin-top-right rounded-md 
        border border-border-light bg-surface-primary shadow-xl animate-slideDown
        lg:absolute lg:right-0 lg:top-full lg:mt-2 lg:w-100 lg:max-w-[384px]
      `}
                  style={{
                    // On mobile, ensure it doesn't go off-screen
                    maxWidth: 'calc(100vw - 1rem)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border-light sticky top-0 bg-surface-primary/95 backdrop-blur-sm z-10 rounded-t-xl">
                    <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <>
                          <Badge variant="info" className="text-xs">{unreadCount} new</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs py-1 px-2 flex items-center gap-1"
                            onClick={async () => {
                              await markAllRead();
                              setNotificationsOpen(false);
                            }}
                            disabled={loading}
                          >
                            <CheckCheck size={12} />
                            Mark all read
                          </Button>
                        </>
                      )}
                      {notificationSettings?.browserNotifications && 'Notification' in window && Notification.permission !== 'granted' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs py-1 px-2"
                          onClick={async () => {
                            const result = await requestNotificationPermission();
                            if (result.success) {
                              refetch();
                            }
                          }}
                        >
                          Enable Browser Notifications
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[50vh] lg:max-h-96 overflow-y-auto scrollbar-thin">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                        <p className="mt-2 text-sm text-text-muted">Loading notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="mx-auto h-10 w-10 text-text-muted" />
                        <p className="mt-2 text-sm text-text-muted">No notifications</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-border-light" role="list" aria-label="Notifications">
                        {notifications.map((notification) => {
                          const isUnread = !notification.read;
                          const channel = notification.metadata?.channel;
                          const channelStr = typeof channel === 'string' ? channel : (channel?.toString?.() ?? '');
                          const title = typeof notification.title === 'string' ? notification.title : (notification.title?.toString?.() ?? 'Notification');
                          const message = notification.message || '';
                          const timeAgo = formatTime(notification.createdAt);
                          // Compute ISO string for datetime attribute
                          const ts = notification.createdAt;
                          const ms = (typeof ts === 'object' && ts?.toDate) ? ts.toDate().getTime()
                            : (typeof ts === 'object' && typeof ts.seconds === 'number') ? ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6)
                              : (typeof ts === 'number') ? ts
                                : 0;
                          const dateISO = ms ? new Date(ms).toISOString() : new Date().toISOString();

                          return (
                            <li
                              key={notification.id}
                              className={`
                    px-4 py-3 transition-colors cursor-pointer relative
                    ${isUnread ? 'bg-primary/5' : 'hover:bg-surface-muted'}
                    ${isUnread ? 'before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary before:rounded-r-md' : ''}
                  `}
                              onClick={() => handleNotificationClick(notification)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNotificationClick(notification); } }}
                              role="button"
                              tabIndex={0}
                              aria-label={isUnread ? `Unread notification: ${title}` : `Read notification: ${title}`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                      ${isUnread ? 'bg-primary/10' : 'bg-surface-muted'}
                    `}>
                                  {(() => {
                                    switch (notification.type) {
                                      case "new_conversation":
                                      case "human_handoff":
                                        return <Bot size={18} className={isUnread ? "text-primary" : "text-text-muted"} />;
                                      case "new_order":
                                        return <Circle size={18} className={isUnread ? "text-success" : "text-text-muted"} />;
                                      case "low_stock":
                                        return <Circle size={18} className={isUnread ? "text-warning" : "text-text-muted"} />;
                                      case "login_alert":
                                        return <Bot size={18} className={isUnread ? "text-error" : "text-text-muted"} />;
                                      default:
                                        return <Bot size={18} className={isUnread ? "text-ai" : "text-text-muted"} />;
                                    }
                                  })()}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${isUnread ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`} truncate>
                                      {title}
                                    </p>
                                    <time className="flex-shrink-0 text-[11px] text-text-muted whitespace-nowrap" dateTime={dateISO}>
                                      {timeAgo}
                                    </time>
                                  </div>

                                  {message && (
                                    <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
                                      {message}
                                    </p>
                                  )}

                                  {/* Channel indicator and unread dot */}
                                  <div className="mt-2 flex items-center gap-2">
                                    {channelStr && (
                                      <Badge
                                        variant={channelStr.toLowerCase() === 'whatsapp' ? 'whatsapp' :
                                          channelStr.toLowerCase() === 'telegram' ? 'telegram' :
                                            channelStr.toLowerCase() === 'instagram' ? 'instagram' :
                                              channelStr.toLowerCase() === 'facebook' ? 'facebook' : 'default'}
                                        className="text-[10px] px-2 py-0.5"
                                      >
                                        {channelStr}
                                      </Badge>
                                    )}
                                    {isUnread && (
                                      <span className="flex h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Footer - View All */}
                  <div className="px-4 py-3 border-t border-border-light sticky bottom-0 bg-surface-primary/95 backdrop-blur-sm z-10 rounded-b-xl">
                    <NavLink
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-primary hover:text-primary-hover hover:bg-primary/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    >
                      View all notifications
                      <ExternalLink size={14} aria-hidden="true" />
                    </NavLink>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ai/10 border border-ai/20">
            <Bot size={14} className="text-ai" aria-hidden="true" />
            <span className="text-xs font-medium text-ai">AI Active</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-ai animate-ping opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ai" />
            </span>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 p-0"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <Avatar name={userName} size="md" online />
            </Button>

            {userMenuOpen && (
              <>
                {/* Backdrop for mobile - closes on click outside */}
                <div
                  className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fadeIn"
                  onClick={() => setUserMenuOpen(false)}
                  aria-hidden="true"
                />

                {/* User Menu Panel - Responsive positioning */}
                <div
                  className={`
        fixed right-4 top-16 z-50 w-full max-w-sm origin-top-right rounded-md 
        border border-border-light bg-surface-primary shadow-xl animate-slideDown
        lg:absolute lg:right-0 lg:top-full lg:mt-2 lg:w-50 lg:max-w-[224px]
      `}
                  style={{
                    maxWidth: 'calc(100vw - 1rem)',
                  }}
                >
                  {/* Header */}
                  <div className="px-4 py-3.5 border-b border-border-light">
                    <p className="text-sm font-semibold text-text-primary truncate">{userName}</p>
                    <p className="mt-0.5 text-xs text-text-muted capitalize">{userRole}</p>
                  </div>

                  {/* Menu Items */}
                  <ul className="py-1.5" role="menu">
                    <li role="none">
                      <NavLink
                        to="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary rounded-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                        role="menuitem"
                      >
                        <Circle size={18} className="text-ai shrink-0" aria-hidden="true" />
                        Settings
                      </NavLink>
                    </li>
                    <li className="h-px bg-border-light mx-3 my-1.5" role="separator" aria-orientation="horizontal" />
                    <li role="none">
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-error hover:bg-surface-muted hover:text-error rounded-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/20"
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await logout();
                        }}
                        role="menuitem"
                      >
                        <X size={18} className="text-error shrink-0" aria-hidden="true" />
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
