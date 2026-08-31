import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.orders.list();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData) => {
    try {
      const newOrder = await api.orders.create(orderData);
      setOrders((current) => [newOrder, ...current]);
      return newOrder;
    } catch (err) {
      console.error('Failed to create order:', err);
      throw err;
    }
  }, []);

  const updateOrder = useCallback(async (orderId, updateData) => {
    try {
      const updated = await api.orders.update(orderId, updateData);
      setOrders((current) => current.map((o) => (o.id === orderId ? updated : o)));
      return updated;
    } catch (err) {
      console.error('Failed to update order:', err);
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (orderId) => {
    try {
      await api.orders.delete(orderId);
      setOrders((current) => current.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error('Failed to delete order:', err);
      throw err;
    }
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
