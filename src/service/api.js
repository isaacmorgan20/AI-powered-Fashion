const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Session storage keys
const SESSION_TOKEN_KEY = 'threados_session_token';
const SESSION_ID_KEY = 'threados_session_id';
const DEVICE_ID_KEY = 'threados_device_id';

function getSessionToken() {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

function getSessionId() {
  return localStorage.getItem(SESSION_ID_KEY);
}

function setSessionData(token, sessionId) {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
  localStorage.setItem(SESSION_ID_KEY, sessionId);
}

function clearSessionData() {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
}

// Device ID management
function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    // Generate a new device ID
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    deviceId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

async function getAuthToken() {
  const { getAuth } = await import('../service/Firebase');
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = await getAuthToken();
  const sessionToken = getSessionToken();
  const sessionId = getSessionId();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  // Add session headers if available
  if (sessionToken && sessionId) {
    headers['X-Session-Token'] = sessionToken;
    headers['X-Session-Id'] = sessionId;
  }
  
  // Add device ID header for device tracking
  const deviceId = getDeviceId();
  if (deviceId) {
    headers['X-Device-ID'] = deviceId;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
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

  // Orders
  orders: {
    list: () => fetchWithAuth('/orders'),
    get: (id) => fetchWithAuth(`/orders/${encodeURIComponent(id)}`),
    create: (data) => fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => fetchWithAuth(`/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id) => fetchWithAuth(`/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  },

  // Analytics
  analytics: {
    get: (range = '30 days') => fetchWithAuth(`/analytics?range=${encodeURIComponent(range)}`),
  },

  // Settings
  settings: {
    get: () => fetchWithAuth('/settings'),
    update: (data) => fetchWithAuth('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  },

  // Storefront (public, no auth required)
  storefront: {
    get: (sellerId) => fetch(`${API_BASE}/storefront/${encodeURIComponent(sellerId)}`).then(r => {
      if (!r.ok) throw new Error('Storefront not available');
      return r.json();
    }),
    products: (sellerId) => fetch(`${API_BASE}/storefront/${encodeURIComponent(sellerId)}/products`).then(r => {
      if (!r.ok) throw new Error('Failed to fetch products');
      return r.json();
    }),
    product: (sellerId, productId) => fetch(`${API_BASE}/storefront/${encodeURIComponent(sellerId)}/products/${encodeURIComponent(productId)}`).then(r => {
      if (!r.ok) throw new Error('Product not found');
      return r.json();
    }),
    chat: (sellerId, data) => fetch(`${API_BASE}/storefront/${encodeURIComponent(sellerId)}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => {
      if (!r.ok) throw new Error('Chat unavailable');
      return r.json();
    }),
  },

  // Notifications
  notifications: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return fetchWithAuth(`/notifications/events${query ? `?${query}` : ''}`);
    },
    create: (data) => fetchWithAuth('/notifications/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    markRead: (id) => fetchWithAuth(`/notifications/events/${id}`, {
      method: 'PATCH',
    }),
    delete: (id) => fetchWithAuth(`/notifications/events/${id}`, {
      method: 'DELETE',
    }),
  },

  // Channels
  channels: {
    list: () => fetchWithAuth('/channels'),
    get: (type) => fetchWithAuth(`/channels/${type}`),
    create: (data) => fetchWithAuth('/channels', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (type, data) => fetchWithAuth(`/channels/${type}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    connect: (type) => fetchWithAuth(`/channels/${type}/connect`, {
      method: 'POST',
    }),
    disconnect: (type) => fetchWithAuth(`/channels/${type}/disconnect`, {
      method: 'POST',
    }),
    delete: (type) => fetchWithAuth(`/channels/${type}`, {
      method: 'DELETE',
    }),
    // WhatsApp-specific endpoints
    whatsapp: {
      setup: (credentials) => fetchWithAuth('/channels/whatsapp/setup', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      disconnect: () => fetchWithAuth('/channels/whatsapp/disconnect', {
        method: 'POST',
      }),
    },
  },

  // Team & Access
  team: {
    list: () => fetchWithAuth('/team'),
    add: (data) => fetchWithAuth('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (memberId, data) => fetchWithAuth(`/team/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    remove: (memberId) => fetchWithAuth(`/team/${memberId}`, {
      method: 'DELETE',
    }),
    acceptInvite: (memberId) => fetchWithAuth(`/team/${memberId}/accept`, {
      method: 'POST',
    }),
  },

  // Business Info
  business: {
    getInfo: () => fetchWithAuth('/business/info'),
  },

  // Sessions & Security
  sessions: {
    create: async () => {
      const session = await fetchWithAuth('/sessions', { method: 'POST' });
      if (session.session_token) {
        setSessionData(session.session_token, session.id);
      }
      return session;
    },
    list: () => fetchWithAuth('/sessions'),
    revoke: (sessionId) => fetchWithAuth(`/sessions/${sessionId}`, {
      method: 'DELETE',
    }),
    revokeAll: () => fetchWithAuth('/sessions/revoke-all', {
      method: 'POST',
    }),
    logoutAll: () => fetchWithAuth('/sessions', {
      method: 'DELETE',
    }),
    clearLocal: clearSessionData,
  },

  // Two-Factor Authentication
  twoFactor: {
    setup: () => fetchWithAuth('/2fa/setup', { method: 'POST' }),
    confirm: (code) => fetchWithAuth(`/2fa/confirm?code=${encodeURIComponent(code)}`, { method: 'POST' }),
    verify: (code) => fetchWithAuth(`/2fa/verify?code=${encodeURIComponent(code)}`, { method: 'POST' }),
    disable: (code) => fetchWithAuth(`/2fa/disable?code=${encodeURIComponent(code)}`, { method: 'POST' }),
    status: () => fetchWithAuth('/2fa/status'),
    regenerateBackupCodes: (code) => fetchWithAuth(`/2fa/regenerate-backup-codes?code=${encodeURIComponent(code)}`, { method: 'POST' }),
  },

  // Security - Login History
  security: {
    loginHistory: (limit = 50) => fetchWithAuth(`/security/login-history?limit=${limit}`),
    knownDevices: () => fetchWithAuth('/security/known-devices'),
  },
};