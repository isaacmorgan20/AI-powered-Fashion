import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';
import { useSettings } from './useSettings';

export function useNotifications() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSettings();
  const notificationSettings = settings?.notifications || {};

  const fetchEvents = useCallback(async (unreadOnly = false) => {
    try {
      setLoading(true);
      const params = unreadOnly ? { unread_only: 'true' } : {};
      const data = await api.notifications.list(params);
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = useCallback(async (eventData) => {
    try {
      const newEvent = await api.notifications.create(eventData);
      setEvents((current) => [newEvent, ...current]);
      return newEvent;
    } catch (err) {
      console.error('Failed to create notification:', err);
      throw err;
    }
  }, []);

  const markRead = useCallback(async (eventId) => {
    try {
      await api.notifications.markRead(eventId);
      setEvents((current) =>
        current.map((e) =>
          e.id === eventId ? { ...e, read: true } : e
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      await api.notifications.delete(eventId);
      setEvents((current) => current.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
      throw err;
    }
  }, []);

  const sendBrowserNotification = useCallback((title, message) => {
    if (notificationSettings.browserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }, [notificationSettings.browserNotifications]);

  const unreadCount = events.filter((e) => !e.read).length;

  return {
    events,
    loading,
    error,
    unreadCount,
    refetch: fetchEvents,
    createEvent,
    markRead,
    deleteEvent,
    sendBrowserNotification,
    notificationSettings,
  };
}
