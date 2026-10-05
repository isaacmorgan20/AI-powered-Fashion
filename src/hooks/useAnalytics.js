import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../service/api';
import { useOnlineStatus } from './useOnlineStatus';
import useAuthStore from '../Store/AuthStore';

const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;
const VALID_RANGES = ['Today', '7 days', '30 days', '90 days'];

function getCacheKeys(range, userId) {
  const safeRange = range.replace(/\s+/g, '_').toLowerCase();
  const userPrefix = userId ? `user_${userId}_` : 'anon_';
  return {
    dataKey: `threados_analytics_${userPrefix}${safeRange}_cache`,
    timestampKey: `threados_analytics_${userPrefix}${safeRange}_cache_ts`,
  };
}

function loadCachedAnalytics(range, userId) {
  try {
    const { dataKey, timestampKey } = getCacheKeys(range, userId);
    const cached = localStorage.getItem(dataKey);
    const timestamp = localStorage.getItem(timestampKey);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_MAX_AGE) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {
    console.warn('Failed to load cached analytics:', e);
  }
  return null;
}

function saveAnalyticsToCache(range, userId, data) {
  try {
    const { dataKey, timestampKey } = getCacheKeys(range, userId);
    localStorage.setItem(dataKey, JSON.stringify(data));
    localStorage.setItem(timestampKey, String(Date.now()));
  } catch (e) {
    console.warn('Failed to cache analytics:', e);
  }
}

function isValidRange(range) {
  return VALID_RANGES.includes(range);
}

export function useAnalytics(range = '30 days') {
  const { isOnline } = useOnlineStatus();
  const authLoading = useAuthStore((s) => s.loading);
  const user = useAuthStore((s) => s.user);
  const userId = user?.uid ?? null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  const abortControllerRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const currentRangeRef = useRef(range);

  useEffect(() => {
    currentRangeRef.current = range;
  }, [range]);

  const loadCache = useCallback(() => {
    if (!userId) return null;
    return loadCachedAnalytics(range, userId);
  }, [range, userId]);

  useEffect(() => {
    if (!authLoading && userId) {
      const cached = loadCache();
      setData(cached);
      setLoading(!cached);
      setIsUsingCache(!!cached);
    } else if (!authLoading && !userId) {
      setLoading(false);
      setIsUsingCache(false);
    }
  }, [authLoading, userId, range, loadCache]);

  const fetchAnalytics = useCallback(async (isRetry = false) => {
    if (!isValidRange(range)) {
      console.error('Invalid range:', range);
      setError('Invalid date range');
      setLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentCachedData = loadCachedAnalytics(range, userId);

    if (!isOnline) {
      if (currentCachedData) {
        setData(currentCachedData);
        setLoading(false);
        setIsUsingCache(true);
        setError('Offline — showing saved analytics data');
      } else {
        setLoading(false);
        setIsUsingCache(false);
        setError('Offline — no saved analytics data available');
      }
      return;
    }

    try {
      if (!currentCachedData && !isRetry) {
        setLoading(true);
      }
      const result = await api.analytics.get(range);
      if (controller.signal.aborted) return;

      saveAnalyticsToCache(range, userId, result);
      setData(result);
      setIsUsingCache(false);
      setError(null);
      hasFetchedRef.current = true;
    } catch (err) {
      if (controller.signal.aborted) return;

      const isNetworkError = err.message?.includes('Failed to fetch') ||
                             err.message?.includes('NetworkError') ||
                             err.message?.includes('Network request failed') ||
                             !navigator.onLine;
      if (isNetworkError && data) {
        setIsUsingCache(true);
        setError('Offline — showing saved analytics data');
      } else if (isNetworkError && !data) {
        setError('Offline — no saved analytics data available');
      } else {
        setError(err.message);
      }
      console.error('Failed to fetch analytics:', err);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [range, isOnline, userId, loadCachedAnalytics]);

  useEffect(() => {
    if (!authLoading && userId && !hasFetchedRef.current) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, authLoading, userId]);

  useEffect(() => {
    if (isOnline && userId && !authLoading && hasFetchedRef.current) {
      fetchAnalytics(true);
    }
  }, [isOnline, fetchAnalytics, userId, authLoading]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, refetch: fetchAnalytics, isUsingCache, isOnline };
}