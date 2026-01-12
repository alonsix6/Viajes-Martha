import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Transaction API methods
export const transactionAPI = {
  // TODO: Implement API methods
  // These will be implemented in the next phase

  getAll: async () => {
    // GET /api/transactions
    throw new Error('Not implemented');
  },

  getById: async (id) => {
    // GET /api/transactions/:id
    throw new Error('Not implemented');
  },

  create: async (data) => {
    // POST /api/transactions
    throw new Error('Not implemented');
  },

  update: async (id, data) => {
    // PUT /api/transactions/:id
    throw new Error('Not implemented');
  },

  delete: async (id) => {
    // DELETE /api/transactions/:id
    throw new Error('Not implemented');
  },

  getStats: async () => {
    // GET /api/transactions/stats
    throw new Error('Not implemented');
  },
};

// Settings API methods
export const settingsAPI = {
  // TODO: Implement API methods

  getSettings: async () => {
    // GET /api/settings
    throw new Error('Not implemented');
  },

  verifyPin: async (pin) => {
    // POST /api/settings/verify-pin
    throw new Error('Not implemented');
  },

  updatePin: async (oldPin, newPin) => {
    // PUT /api/settings/pin
    throw new Error('Not implemented');
  },
};

export default api;
