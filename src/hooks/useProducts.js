import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';
import { useOnlineStatus } from './useOnlineStatus';

const CACHE_KEY = 'threados_products_cache';
const CACHE_TIMESTAMP_KEY = 'threados_products_cache_ts';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function loadCachedProducts() {
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
    console.warn('Failed to load cached products:', e);
  }
  return null;
}

function saveProductsToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (e) {
    console.warn('Failed to cache products:', e);
  }
}

export function useProducts() {
  const [products, setProducts] = useState(() => loadCachedProducts() || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOnline } = useOnlineStatus();

  const fetchProducts = useCallback(async () => {
    if (!isOnline) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api.products.list();
      saveProductsToCache(data);
      setProducts(data);
      setError(null);
    } catch (err) {
      const isNetworkError = err.message?.includes('Failed to fetch') || 
                             err.message?.includes('NetworkError') || 
                             err.message?.includes('Network request failed') ||
                             !navigator.onLine;
      if (isNetworkError && products.length > 0) {
        setError('Offline — showing saved data');
      } else {
        setError(err.message);
      }
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [products.length, isOnline]);

  useEffect(() => {
    const cached = loadCachedProducts();
    if (cached && cached.length > 0) {
      setLoading(false);
    }
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = useCallback(async (productData) => {
    try {
      const newProduct = await api.products.create(productData);
      setProducts((current) => [...current, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Failed to create product:', err);
      throw err;
    }
  }, []);

  const updateProduct = useCallback(async (productId, updateData) => {
    try {
      const updated = await api.products.update(productId, updateData);
      setProducts((current) =>
        current.map((p) => (p.id === productId ? updated : p))
      );
      return updated;
    } catch (err) {
      console.error('Failed to update product:', err);
      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (productId) => {
    try {
      await api.products.delete(productId);
      setProducts((current) => current.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw err;
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setProducts,
    isOnline,
  };
}
