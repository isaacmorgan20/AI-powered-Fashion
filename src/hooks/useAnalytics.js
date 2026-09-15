import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';
import { useOnlineStatus } from './useOnlineStatus';

const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

function getCacheKeys(range) {
  const safeRange = range.replace(/\s+/g, '_').toLowerCase();
  return {
    dataKey: `threados_analytics_${safeRange}_cache`,
    timestampKey: `threados_analytics_${safeRange}_cache_ts`,
  };
}

function loadCachedAnalytics(range) {
  try {
    const { dataKey, timestampKey } = getCacheKeys(range);
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

function saveAnalyticsToCache(range, data) {
  try {
    const { dataKey, timestampKey } = getCacheKeys(range);
    localStorage.setItem(dataKey, JSON.stringify(data));
    localStorage.setItem(timestampKey, String(Date.now()));
  } catch (e) {
    console.warn('Failed to cache analytics:', e);
  }
}

export function useAnalytics(range = '30 days') {
  const { isOnline } = useOnlineStatus();
  const cachedData = loadCachedAnalytics(range);

  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!isOnline) {
      if (cachedData) {
        setLoading(false);
      }
      return;
    }
    try {
      if (!cachedData) {
        setLoading(true);
      }
      const result = await api.analytics.get(range);
      saveAnalyticsToCache(range, result);
      setData(result);
      setError(null);
    } catch (err) {
      const isNetworkError = err.message?.includes('Failed to fetch') ||
                             err.message?.includes('NetworkError') ||
                             err.message?.includes('Network request failed') ||
                             !navigator.onLine;
      if (isNetworkError && data) {
        setError('Offline — showing saved analytics data');
      } else {
        setError(err.message);
      }
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [range, isOnline, data, cachedData]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}