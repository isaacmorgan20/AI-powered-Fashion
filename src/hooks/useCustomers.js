import { useState, useEffect, useCallback } from 'react';
import { api } from '../service/api';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.customers.list();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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
  };
}