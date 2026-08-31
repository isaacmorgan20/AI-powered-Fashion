import { useState, useCallback } from 'react';
import { api } from '../service/api';

export function useAIChat() {
  const [loading, setLoading] = useState(false);

  const sendToAI = useCallback(async (message, conversationId, conversationHistory) => {
    setLoading(true);
    try {
      const response = await api.chat.send(message, conversationId, conversationHistory);
      return response;
    } catch (err) {
      console.error('AI chat error:', err);
      return {
        response: "I'm having trouble connecting to the AI service. Please try again.",
        intent: 'error',
        confidence: 0,
        requiresHandoff: true,
        handoffReason: err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendToAI, loading };
}