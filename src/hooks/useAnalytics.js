import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';

export function useAnalytics(range = '30 days') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.analytics.get(range);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}
