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
export const getTransactions = async (params) => {
  const response = await api.get('/api/transactions', { params });
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await api.post('/api/transactions', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await api.put(`/api/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/api/transactions/${id}`);
  return response.data;
};

// Stats API methods
export const getBalance = async () => {
  const response = await api.get('/api/stats/balance');
  return response.data;
};

export const getCurrentMonthStats = async () => {
  const response = await api.get('/api/stats/current-month');
  return response.data;
};

// Settings API methods
export const getSetting = async (key) => {
  const response = await api.get(`/api/settings/${key}`);
  return response.data;
};

export const updateSetting = async (key, value) => {
  const response = await api.put(`/api/settings/${key}`, { value });
  return response.data;
};

export const verifyPin = async (pin) => {
  const response = await api.post('/api/settings/verify-pin', { pin });
  return response.data;
};

export const updatePin = async (oldPin, newPin) => {
  const response = await api.put('/api/settings/pin', { oldPin, newPin });
  return response.data;
};

export default api;
