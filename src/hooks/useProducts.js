import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.products.list();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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
  };
}
