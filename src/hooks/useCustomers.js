import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';
import { useOnlineStatus } from './useOnlineStatus';

const CACHE_KEY = 'threados_customers_cache';
const CACHE_TIMESTAMP_KEY = 'threados_customers_cache_ts';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function loadCachedCustomers() {
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
    console.warn('Failed to load cached customers:', e);
  }
  return null;
}

function saveCustomersToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (e) {
    console.warn('Failed to cache customers:', e);
  }
}

export function useCustomers() {
  const [customers, setCustomers] = useState(() => loadCachedCustomers() || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOnline } = useOnlineStatus();

  const fetchCustomers = useCallback(async () => {
    if (!isOnline) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api.customers.list();
      saveCustomersToCache(data);
      setCustomers(data);
      setError(null);
    } catch (err) {
      const isNetworkError = err.message?.includes('Failed to fetch') || 
                             err.message?.includes('NetworkError') || 
                             err.message?.includes('Network request failed') ||
                             !navigator.onLine;
      if (isNetworkError && customers.length > 0) {
        setError('Offline — showing saved data');
      } else {
        setError(err.message);
      }
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  }, [customers.length, isOnline]);

  useEffect(() => {
    const cached = loadCachedCustomers();
    if (cached && cached.length > 0) {
      setLoading(false);
    }
    fetchCustomers();
  }, [fetchCustomers]);

  const createCustomer = useCallback(async (customerData) => {
    try {
      const newCustomer = await api.customers.create(customerData);
      setCustomers((current) => [newCustomer, ...current]);
      return newCustomer;
    } catch (err) {
      console.error('Failed to create customer:', err);
      throw err;
    }
  }, []);

  const updateCustomer = useCallback(async (customerId, updateData) => {
    try {
      const updatedCustomer = await api.customers.update(customerId, updateData);
      setCustomers((current) =>
        current.map((c) => (c.id === customerId ? updatedCustomer : c))
      );
      return updatedCustomer;
    } catch (err) {
      console.error('Failed to update customer:', err);
      throw err;
    }
  }, []);

  const deleteCustomer = useCallback(async (customerId) => {
    try {
      await api.customers.delete(customerId);
      setCustomers((current) => current.filter((c) => c.id !== customerId));
    } catch (err) {
      console.error('Failed to delete customer:', err);
      throw err;
    }
  }, []);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    isOnline,
  };
}