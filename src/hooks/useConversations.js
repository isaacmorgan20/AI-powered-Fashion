import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';
import { useSettings } from './useSettings';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingStates, setSendingStates] = useState({}); // conversationId -> 'sending' | 'failed' | 'sent'
  const { settings } = useSettings();
  const timezone = settings?.general?.timezone || "Africa/Accra";

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.conversations.list();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const selectConversation = useCallback((id) => {
    setConversations((current) =>
      current.map((conv) =>
        conv.id === id ? { ...conv, unread: 0 } : conv
      )
    );
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
    refetch: fetchConversations,
    selectConversation,
    sendMessage,
    takeOver,
    returnToAI,
    markResolved,
    reopenConversation,
    sendingStates,
  };
}