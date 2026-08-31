const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function getAuthToken() {
  const { getAuth } = await import('../service/Firebase');
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Conversations
  conversations: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchWithAuth(`/conversations${query ? `?${query}` : ''}`);
    },
    get: (id) => fetchWithAuth(`/conversations/${id}`),
    create: (data) => fetchWithAuth('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => fetchWithAuth(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    sendMessage: (conversationId, content, senderType = 'human') =>
      fetchWithAuth(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, senderType }),
      }),
  },

  // Customers
  customers: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchWithAuth(`/customers${query ? `?${query}` : ''}`);
    },
    get: (id) => fetchWithAuth(`/customers/${id}`),
    create: (data) => fetchWithAuth('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => fetchWithAuth(`/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id) => fetchWithAuth(`/customers/${id}`, {
      method: 'DELETE',
    }),
  },

  // AI Chat
  chat: {
    send: (message, conversationId, conversationHistory = []) =>
      fetchWithAuth('/chat', {
        method: 'POST',
        body: JSON.stringify({ message, conversationId, conversationHistory }),
      }),
  },

  // Products
  products: {
    list: () => fetchWithAuth('/products'),
    get: (id) => fetchWithAuth(`/products/${id}`),
    create: (data) => fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => fetchWithAuth(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id) => fetchWithAuth(`/products/${id}`, {
      method: 'DELETE',
    }),
  },

  // Business Info
  business: {
    getInfo: () => fetchWithAuth('/business/info'),
  },
};