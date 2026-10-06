import React, { useMemo, useCallback } from "react";
import { Bell, ExternalLink, Filter, Bot, CheckCheck } from "lucide-react";
import { Button, Badge, Avatar, Input } from "../Components/ui";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const { events: notifications, loading, unreadCount, markAllRead, handleNotificationClick } = useNotifications(navigate);

  const [filter, setFilter] = React.useState("all"); // all, unread
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    
    if (filter === "unread") {
      filtered = filtered.filter(n => !n.read);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        (n.title?.toString?.().toLowerCase().includes(query)) ||
        (n.message?.toLowerCase().includes(query)) ||
        (n.metadata?.channel?.toString?.().toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [notifications, filter, searchQuery]);

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

  const getNotificationIcon = (type, isUnread) => {
    const size = 18;
    const unreadClass = isUnread ? "text-primary" : "text-text-muted";
    const readClass = "text-text-muted";
    
    switch (type) {
      case "new_conversation":
      case "human_handoff":
        return <Bot size={size} className={isUnread ? unreadClass : readClass} />;
      case "new_order":
        return <Avatar name="📦" size="sm" className={isUnread ? "bg-success/10 text-success" : "bg-surface-muted text-text-muted"} />;
      case "low_stock":
        return <Avatar name="⚠️" size="sm" className={isUnread ? "bg-warning/10 text-warning" : "bg-surface-muted text-text-muted"} />;
      case "login_alert":
        return <Avatar name="🔐" size="sm" className={isUnread ? "bg-error/10 text-error" : "bg-surface-muted text-text-muted"} />;
      default:
        return <Bot size={size} className={isUnread ? "text-ai" : readClass} />;
    }
  };

  const getChannelBadgeVariant = (channel) => {
    const norm = String(channel || "").toLowerCase();
    if (norm.includes("whatsapp")) return "whatsapp";
    if (norm.includes("telegram")) return "telegram";
    if (norm.includes("instagram")) return "instagram";
    if (norm.includes("facebook")) return "facebook";
    return "default";
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-border-light">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Bell size={24} className="text-primary" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage and view all your notifications
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5"
            >
              <CheckCheck size={14} />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar - Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-sm"
            aria-label="Search notifications"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={filter === "all" ? "primary" : "default"} 
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setFilter("all")}
          >
            All
          </Badge>
          <Badge variant={filter === "unread" ? "info" : "default"} 
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">{unreadCount}</span>}
          </Badge>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <Bell className="mx-auto h-14 w-14 text-text-muted" />
            <h3 className="mt-4 text-lg font-medium text-text-primary">
              {searchQuery ? "No matching notifications" : "No notifications"}
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {searchQuery 
                ? `No notifications found for "${searchQuery}"` 
                : "You're all caught up!"
              }
            </p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto scrollbar-thin">
            <ul className="divide-y divide-border-light" role="list" aria-label="Notifications">
              {filteredNotifications.map((notification) => {
                const isUnread = !notification.read;
                const channel = notification.metadata?.channel;
                const channelStr = typeof channel === 'string' ? channel : (channel?.toString?.() ?? '');
                const title = typeof notification.title === 'string' ? notification.title : (notification.title?.toString?.() ?? 'Notification');
                const message = notification.message || '';
                
                return (
                  <li
                    key={notification.id}
                    className={`
                      px-4 py-4 transition-colors cursor-pointer relative hover:bg-surface-muted
                      ${isUnread ? 'bg-primary/5 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary before:rounded-r-md' : ''}
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
                        flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                        ${isUnread ? 'bg-primary/10' : 'bg-surface-muted'}
                      `}>
                        {getNotificationIcon(notification.type, isUnread)}
                      </div>
                      
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-base ${isUnread ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`} truncate>
                            {title}
                          </p>
                          <time className="flex-shrink-0 text-sm text-text-muted whitespace-nowrap" dateTime={new Date(notification.createdAt).toISOString()}>
                            {formatTime(notification.createdAt)}
                          </time>
                        </div>
                        
                        {message && (
                          <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                            {message}
                          </p>
                        )}
                        
                        {/* Channel indicator and unread dot */}
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          {channelStr && (
                            <Badge 
                              variant={getChannelBadgeVariant(channelStr)}
                              className="text-xs px-2.5 py-1"
                            >
                              {channelStr}
                            </Badge>
                          )}
                          {isUnread && (
                            <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                      
                      {/* Navigate indicator */}
                      <div className="flex-shrink-0 flex items-center justify-center text-text-muted">
                        <ExternalLink size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;