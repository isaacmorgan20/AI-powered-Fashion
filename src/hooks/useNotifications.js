import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../service/api';
import { useSettings } from './useSettings';
import useAuthStore from '../Store/AuthStore';
import { db } from '../service/Firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export function useNotifications(navigate) {
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

  // Convert Firestore Timestamp to milliseconds
  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return null;
    // Firestore Timestamp object has toDate() method or seconds/nanoseconds properties
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().getTime();
    }
    if (typeof timestamp.seconds === 'number') {
      return timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds || 0) / 1e6);
    }
    if (typeof timestamp === 'number') {
      return timestamp;
    }
    return null;
  };

  // Normalize notification data from Firestore
  const normalizeNotification = (doc) => {
    const data = doc.data();
    const normalized = { id: doc.id, ...data };
    // Convert createdAt to milliseconds
    if (normalized.createdAt) {
      normalized.createdAt = normalizeTimestamp(normalized.createdAt);
    }
    // Ensure metadata is a plain object
    if (normalized.metadata && typeof normalized.metadata === 'object') {
      normalized.metadata = { ...normalized.metadata };
    }
    // Sanitize: remove any React SyntheticEvent-like properties that could cause render errors
    // These properties indicate a React event object was accidentally merged into the data
    const syntheticEventKeys = [
      '_reactName', '_targetInst', 'nativeEvent', 'target', 'currentTarget',
      'eventPhase', 'bubbles', 'cancelable', 'timeStamp', 'defaultPrevented',
      'isTrusted', 'isDefaultPrevented', 'isPropagationStopped'
    ];
    syntheticEventKeys.forEach(key => {
      delete normalized[key];
      if (normalized.metadata && typeof normalized.metadata === 'object') {
        delete normalized.metadata[key];
      }
    });
    return normalized;
  };

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
        let targetPath = null;
        if (data.conversationId) {
          targetPath = `/inbox?conversation=${data.conversationId}`;
        } else if (data.orderId) {
          targetPath = `/orders/${data.orderId}`;
        } else if (data.productId) {
          targetPath = `/products/${data.productId}`;
        } else if (data.customerId) {
          targetPath = `/customers/${data.customerId}`;
        }
        if (targetPath) {
          window.location.href = targetPath;
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

    const setupListener = async () => {
      try {
        // Initial fetch (already done by initial fetch effect, but ensures data)
        fetchEvents();

        // Subscribe to real-time updates using modular Firestore SDK
        const notificationsCol = collection(db, 'users', user.uid, 'notifications');
        const notificationsQuery = query(
          notificationsCol,
          orderBy('createdAt', 'desc'),
          limit(50)
        );

        unsubscribe = onSnapshot(
          notificationsQuery,
          (snapshot) => {
            if (!isMountedRef.current) return;
            
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const newEvent = normalizeNotification(change.doc);
                
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
                    orderId: newEvent.metadata?.order_id,
                    productId: newEvent.metadata?.product_id,
                    customerId: newEvent.metadata?.customer_id,
                  });
                }
              } else if (change.type === 'modified') {
                const updatedEvent = normalizeNotification(change.doc);
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

  const markAllRead = useCallback(async () => {
    try {
      await api.notifications.markAllRead();
      setEvents((current) =>
        current.map((e) => ({ ...e, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    // Mark as read
    if (!notification.read) {
      markRead(notification.id);
    }
    // Navigate based on notification type and metadata
    const meta = notification.metadata || {};
    let targetPath = null;
    
    if (meta.conversation_id) {
      targetPath = `/inbox?conversation=${meta.conversation_id}`;
    } else if (meta.order_id) {
      targetPath = `/orders/${meta.order_id}`;
    } else if (meta.product_id) {
      targetPath = `/products/${meta.product_id}`;
    } else if (meta.customer_id) {
      targetPath = `/customers/${meta.customer_id}`;
    }
    
    if (targetPath) {
      if (navigate) {
        navigate(targetPath);
      } else {
        window.location.href = targetPath;
      }
    }
  }, [markRead, navigate]);

  const unreadCount = events.filter((e) => !e.read).length;

  return {
    events,
    loading,
    error,
    unreadCount,
    refetch: fetchEvents,
    createEvent,
    markRead,
    markAllRead,
    deleteEvent,
    sendBrowserNotification,
    requestNotificationPermission,
    handleNotificationClick,
    notificationSettings,
  };
}