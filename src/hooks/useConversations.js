import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../service/api';
import { useSettings } from './useSettings';
import { useOnlineStatus } from './useOnlineStatus';

const CACHE_KEY = 'threados_conversations_cache';
const CACHE_TIMESTAMP_KEY = 'threados_conversations_cache_ts';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function loadCachedConversations() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_MAX_AGE) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {
    console.warn('Failed to load cached conversations:', e);
  }
  return null;
}

function saveConversationsToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (e) {
    console.warn('Failed to cache conversations:', e);
  }
}

// Keeps every useConversations() instance (e.g. Sidebar layout + Inbox page)
// in sync when a conversation is marked as read.
const conversationReadListeners = new Set();

function notifyConversationRead(conversationId) {
  conversationReadListeners.forEach((listener) => listener(conversationId));
}

export function useConversations() {
  const [conversations, setConversations] = useState(() => loadCachedConversations() || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingStates, setSendingStates] = useState({});
  const { settings } = useSettings();
  const { isOnline } = useOnlineStatus();
  const timezone = settings?.general?.timezone || "Africa/Accra";
  
  const isInitialLoadComplete = useRef(false);
  const pollingIntervalRef = useRef(null);
  const previousOnlineStatus = useRef(isOnline);

  const fetchConversations = useCallback(async (isPolling = false) => {
    if (!isOnline && !isPolling) {
      setLoading(false);
      return;
    }
    try {
      if (!isPolling) {
        setLoading(true);
      }
      const data = await api.conversations.list();
      saveConversationsToCache(data);
      
      setConversations((current) => {
        // Merge conversations by ID to preserve local state (unread, messages, etc.)
        const currentMap = new Map(current.map(c => [c.id, c]));
        const newMap = new Map(data.map(c => [c.id, c]));
        
        const merged = [];
        
        // Keep existing conversations, update with server data
        for (const [id, serverConv] of newMap) {
          const localConv = currentMap.get(id);
          if (localConv) {
            // If local unread is 0 (user has read), keep it at 0.
            // Otherwise, prefer the higher unread count (server wins for new messages).
            const unread = localConv.unread === 0 ? 0 : Math.max(serverConv.unread || 0, localConv.unread || 0);
            
            // Merge messages: prefer server messages but keep optimistic ones
            const serverMessages = serverConv.messages || [];
            const localMessages = localConv.messages || [];
            const optimisticMessages = localMessages.filter(m => m._optimistic);
            const mergedMessages = [...serverMessages, ...optimisticMessages];
            
            // CRITICAL: Always prefer server data for name/initials to prevent stale fallback names from cache
            merged.push({
              ...serverConv,
              unread,
              messages: mergedMessages,
            });
          } else {
            // New conversation from server
            merged.push(serverConv);
          }
        }
        
        return merged;
      });
      
      setError(null);
      isInitialLoadComplete.current = true;
    } catch (err) {
      const isNetworkError = err.message?.includes('Failed to fetch') || 
                           err.message?.includes('NetworkError') || 
                           err.message?.includes('Network request failed') ||
                           !navigator.onLine;
      if (isNetworkError && conversations.length > 0) {
        setError('Offline — showing saved data');
      } else {
        setError(err.message);
      }
      console.error('Failed to fetch conversations:', err);
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  }, [conversations.length, isOnline]);

  // Initial load
  useEffect(() => {
    const cached = loadCachedConversations();
    if (cached && cached.length > 0) {
      setLoading(false);
    }
    fetchConversations(false);
  }, [fetchConversations]);

  // Refetch when coming back online to replace stale cached fallback names with fresh server data
  useEffect(() => {
    if (isOnline && !previousOnlineStatus.current) {
      fetchConversations(false);
    }
    previousOnlineStatus.current = isOnline;
  }, [isOnline, fetchConversations]);

  // Start polling after initial load
  useEffect(() => {
    const POLL_INTERVAL = 30000; // 30 seconds (reduced from 4s to reduce Firestore quota usage)
    
    // Wait for initial load before starting polling
    const checkAndStartPolling = () => {
      if (isInitialLoadComplete.current) {
        pollingIntervalRef.current = setInterval(() => {
          fetchConversations(true); // isPolling = true
        }, POLL_INTERVAL);
      } else {
        // Check again shortly
        setTimeout(checkAndStartPolling, 500);
      }
    };
    
    checkAndStartPolling();
    
    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [fetchConversations]);

  // Mirror "marked as read" updates into every other hook instance
  useEffect(() => {
    const handleConversationRead = (conversationId) => {
      setConversations((current) =>
        current.map((conv) =>
          conv.id === conversationId ? { ...conv, unread: 0 } : conv
        )
      );
    };

    conversationReadListeners.add(handleConversationRead);
    return () => {
      conversationReadListeners.delete(handleConversationRead);
    };
  }, []);

  const selectConversation = useCallback((id) => {
    // Update local state immediately for responsive UI
    setConversations((current) =>
      current.map((conv) =>
        conv.id === id ? { ...conv, unread: 0 } : conv
      )
    );

    // Keep other instances (sidebar badge) in sync
    notifyConversationRead(id);

    // Persist read status to backend
    api.conversations.update(id, { unread: 0 }).catch((err) => {
      console.error('Failed to mark conversation as read:', err);
      // Optionally revert local state on failure
      // setConversations((current) => current.map((conv) => conv.id === id ? { ...conv, unread: conv.unread || 0 } : conv));
    });
  }, []);

  const sendMessage = useCallback(async (conversationId, content) => {
    const newMessage = {
      id: Date.now(),
      sender: 'human',
      content,
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: timezone }),
      _optimistic: true,
    };

    // Optimistic update
    setConversations((current) =>
      current.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              mode: 'human',
              conversationStatus: 'open',
              lastMessage: content,
              time: 'now',
              messages: [...conv.messages, newMessage],
            }
          : conv
      )
    );
    setSendingStates((prev) => ({ ...prev, [conversationId]: 'sending' }));

    try {
      await api.conversations.sendMessage(conversationId, content, 'human');
      setSendingStates((prev) => ({ ...prev, [conversationId]: 'sent' }));
      // Clear sent state after a delay
      setTimeout(() => {
        setSendingStates((prev) => {
          const next = { ...prev };
          delete next[conversationId];
          return next;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to send message:', err);
      setSendingStates((prev) => ({ ...prev, [conversationId]: 'failed' }));
      // Revert optimistic update on failure
      setConversations((current) =>
        current.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: conv.messages.filter((m) => m._optimistic !== true),
                lastMessage: conv.messages[conv.messages.length - 1]?.content || conv.lastMessage,
                time: conv.messages[conv.messages.length - 1]?.time || conv.time,
              }
            : conv
        )
      );
    }
  }, [timezone]);

  const takeOver = useCallback(async (conversationId) => {
    // Store previous state for potential revert
    let previousConv = null;
    setConversations((current) => {
      const conv = current.find((c) => c.id === conversationId);
      if (conv) previousConv = { ...conv };
      return current.map((c) =>
        c.id === conversationId
          ? { ...c, mode: 'human', conversationStatus: 'open' }
          : c
      );
    });

    try {
      await api.conversations.update(conversationId, {
        mode: 'human',
        conversationStatus: 'open',
      });
    } catch (err) {
      console.error('Failed to take over:', err);
      // Revert on failure
      if (previousConv) {
        setConversations((current) =>
          current.map((c) => (c.id === conversationId ? previousConv : c))
        );
      }
    }
  }, []);

  const returnToAI = useCallback(async (conversationId) => {
    let previousConv = null;
    setConversations((current) => {
      const conv = current.find((c) => c.id === conversationId);
      if (conv) previousConv = { ...conv };
      return current.map((c) =>
        c.id === conversationId
          ? { ...c, mode: 'ai', conversationStatus: 'open' }
          : c
      );
    });

    try {
      await api.conversations.update(conversationId, {
        mode: 'ai',
        conversationStatus: 'open',
      });
    } catch (err) {
      console.error('Failed to return to AI:', err);
      if (previousConv) {
        setConversations((current) =>
          current.map((c) => (c.id === conversationId ? previousConv : c))
        );
      }
    }
  }, []);

  const markResolved = useCallback(async (conversationId) => {
    let previousConv = null;
    setConversations((current) => {
      const conv = current.find((c) => c.id === conversationId);
      if (conv) previousConv = { ...conv };
      return current.map((c) =>
        c.id === conversationId
          ? { ...c, conversationStatus: 'resolved', unread: 0 }
          : c
      );
    });

    // Keep other instances (sidebar badge) in sync
    notifyConversationRead(conversationId);

    try {
      await api.conversations.update(conversationId, {
        conversationStatus: 'resolved',
        unread: 0,
      });
    } catch (err) {
      console.error('Failed to mark resolved:', err);
      if (previousConv) {
        setConversations((current) =>
          current.map((c) => (c.id === conversationId ? previousConv : c))
        );
      }
    }
  }, []);

  const reopenConversation = useCallback(async (conversationId) => {
    let previousConv = null;
    setConversations((current) => {
      const conv = current.find((c) => c.id === conversationId);
      if (conv) previousConv = { ...conv };
      return current.map((c) =>
        c.id === conversationId
          ? { ...c, conversationStatus: 'open' }
          : c
      );
    });

    try {
      await api.conversations.update(conversationId, {
        conversationStatus: 'open',
      });
    } catch (err) {
      console.error('Failed to reopen:', err);
      if (previousConv) {
        setConversations((current) =>
          current.map((c) => (c.id === conversationId ? previousConv : c))
        );
      }
    }
  }, []);

  return {
    conversations,
    setConversations,
    loading,
    error,
    refetch: () => fetchConversations(false),
    selectConversation,
    sendMessage,
    takeOver,
    returnToAI,
    markResolved,
    reopenConversation,
    sendingStates,
    isOnline,
  };
}