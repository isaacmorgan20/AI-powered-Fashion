import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../service/api';
import { useSettings } from './useSettings';
import useAuthStore from '../Store/AuthStore';

export function useNotifications() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { settings } = useSettings();
  const { user } = useAuthStore();
  const notificationSettings = settings?.notifications || {};
  
  // Refs for real-time listener and cleanup
  const isMountedRef = useRef(true);
  const seenNotificationIdsRef = useRef(new Set());
  const notificationSettingsRef = useRef(notificationSettings);
  
  // Keep settings ref updated
  useEffect(() => {
    notificationSettingsRef.current = notificationSettings;
  }, [notificationSettings]);

  // Send browser notification
  const sendBrowserNotification = useCallback((title, message, data = {}) => {
    const currentSettings = notificationSettingsRef.current;
    if (!currentSettings?.browserNotifications) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: data.notificationId || 'threados-notification',
        data: data,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        if (data.conversationId) {
          window.location.href = `/inbox?conversation=${data.conversationId}`;
        }
        notification.close();
      };
    } catch (err) {
      console.error('Failed to show browser notification:', err);
    }
  }, []);

  const fetchEvents = useCallback(async (unreadOnly = false) => {
    if (!isMountedRef.current) return;
    try {
      setLoading(true);
      const params = unreadOnly ? { unread_only: 'true' } : {};
      const data = await api.notifications.list(params);
      if (isMountedRef.current) {
        setEvents(data);
        // Track seen notification IDs to prevent duplicates from listener
        data.forEach(e => seenNotificationIdsRef.current.add(e.id));
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message);
        console.error('Failed to fetch notifications:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
}, []);
 
 // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Set up real-time Firestore listener for new notifications
  useEffect(() => {
    if (!user?.uid) return;

    let unsubscribe = null;
    let db = null;

    const setupListener = async () => {
      try {
        const { getFirestoreClient } = await import('../service/Firebase');
        const firestore = getFirestoreClient();
        db = firestore;
        
        // Initial fetch (already done by initial fetch effect, but ensures data)
        fetchEvents();

        // Subscribe to real-time updates
        const notificationsRef = db.collection('users').document(user.uid).collection('notifications')
          .orderBy('createdAt', 'desc')
          .limit(50);

        unsubscribe = notificationsRef.onSnapshot(
          (snapshot) => {
            if (!isMountedRef.current) return;
            
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const newEvent = { id: change.doc.id, ...change.doc.data() };
                
                // Prevent duplicate notifications
                if (seenNotificationIdsRef.current.has(newEvent.id)) {
                  return;
                }
                seenNotificationIdsRef.current.add(newEvent.id);

                setEvents((current) => {
                  // Check if already exists (in case of race condition)
                  if (current.some(e => e.id === newEvent.id)) {
                    return current;
                  }
                  return [newEvent, ...current].slice(0, 50);
                });

                // Send browser notification if enabled and not read
                const currentSettings = notificationSettingsRef.current;
                if (!newEvent.read && currentSettings?.browserNotifications) {
                  sendBrowserNotification(newEvent.title, newEvent.message, {
                    notificationId: newEvent.id,
                    conversationId: newEvent.metadata?.conversation_id,
                  });
                }
              } else if (change.type === 'modified') {
                const updatedEvent = { id: change.doc.id, ...change.doc.data() };
                setEvents((current) =>
                  current.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
                );
              } else if (change.type === 'removed') {
                setEvents((current) => current.filter((e) => e.id !== change.doc.id));
                seenNotificationIdsRef.current.delete(change.doc.id);
              }
            });
          },
          (err) => {
            console.error('Notification listener error:', err);
            // Fallback to polling if listener fails
            fetchEvents();
          }
        );
      } catch (err) {
        console.error('Failed to setup notification listener:', err);
        fetchEvents();
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    };
  }, [user?.uid, fetchEvents, sendBrowserNotification]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return { success: false, reason: 'not_supported' };
    }
    if (Notification.permission === 'granted') {
      return { success: true };
    }
    if (Notification.permission === 'denied') {
      return { success: false, reason: 'denied' };
    }
    try {
      const permission = await Notification.requestPermission();
      return { success: permission === 'granted', reason: permission };
    } catch (err) {
      console.error('Failed to request notification permission:', err);
      return { success: false, reason: 'error' };
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    try {
      const newEvent = await api.notifications.create(eventData);
      setEvents((current) => {
        if (current.some(e => e.id === newEvent.id)) return current;
        return [newEvent, ...current].slice(0, 50);
      });
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
      seenNotificationIdsRef.current.delete(eventId);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      throw err;
    }
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    // Mark as read
    if (!notification.read) {
      markRead(notification.id);
    }
    // Navigate to conversation if metadata contains conversation_id
    if (notification.metadata?.conversation_id) {
      window.location.href = `/inbox?conversation=${notification.metadata.conversation_id}`;
    }
  }, [markRead]);

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
    requestNotificationPermission,
    handleNotificationClick,
    notificationSettings,
  };
}