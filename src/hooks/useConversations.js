import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';
import { useSettings } from './useSettings';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    };

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

    try {
      await api.conversations.sendMessage(conversationId, content, 'human');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [timezone]);

  const takeOver = useCallback(async (conversationId) => {
    setConversations((current) =>
      current.map((conv) =>
        conv.id === conversationId
          ? { ...conv, mode: 'human', conversationStatus: 'open' }
          : conv
      )
    );

    try {
      await api.conversations.update(conversationId, {
        mode: 'human',
        conversationStatus: 'open',
      });
    } catch (err) {
      console.error('Failed to take over:', err);
    }
  }, []);

  const returnToAI = useCallback(async (conversationId) => {
    setConversations((current) =>
      current.map((conv) =>
        conv.id === conversationId
          ? { ...conv, mode: 'ai', conversationStatus: 'open' }
          : conv
      )
    );

    try {
      await api.conversations.update(conversationId, {
        mode: 'ai',
        conversationStatus: 'open',
      });
    } catch (err) {
      console.error('Failed to return to AI:', err);
    }
  }, []);

  const markResolved = useCallback(async (conversationId) => {
    setConversations((current) =>
      current.map((conv) =>
        conv.id === conversationId
          ? { ...conv, conversationStatus: 'resolved', unread: 0 }
          : conv
      )
    );

    try {
      await api.conversations.update(conversationId, {
        conversationStatus: 'resolved',
        unread: 0,
      });
    } catch (err) {
      console.error('Failed to mark resolved:', err);
    }
  }, []);

  const reopenConversation = useCallback(async (conversationId) => {
    setConversations((current) =>
      current.map((conv) =>
        conv.id === conversationId
          ? { ...conv, conversationStatus: 'open' }
          : conv
      )
    );

    try {
      await api.conversations.update(conversationId, {
        conversationStatus: 'open',
      });
    } catch (err) {
      console.error('Failed to reopen:', err);
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
  };
}