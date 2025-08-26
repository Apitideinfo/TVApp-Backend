import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:5000/api';

const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
adminApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAuth = {
  login: (credentials: { admin_id: string; password: string }) =>
    adminApi.post('/login', credentials),
  checkAdminExists: () => adminApi.get('/check-exists'),
  setupAdmin: (data: { admin_id: string; username: string; password: string }) =>
    adminApi.post('/setup', data),
};

export const adminDashboard = {
  getDashboardData: () => adminApi.get('/dashboard'),
  getAnalytics: () => adminApi.get('/analytics'),
};

export const adminCollections = {
  getCollections: (params: any) => adminApi.get('/collections', { params }),
  getCollection: (id: number) => adminApi.get(`/collections/${id}`),
  updateCollection: (id: number, data: any) =>
    adminApi.put(`/collections/${id}`, data),
  deleteCollection: (id: number) => adminApi.delete(`/collections/${id}`),
};

export const adminWorkers = {
  getWorkers: () => adminApi.get('/workers'),
  getWorker: (id: number) => adminApi.get(`/workers/${id}`),
  updateWorker: (id: number, data: any) =>
    adminApi.put(`/workers/${id}`, data),
};

export const adminCustomers = {
  getCustomers: (params: any) => adminApi.get('/customers', { params }),
  getCustomer: (id: number) => adminApi.get(`/customers/${id}`),
};

export const adminPayments = {
  getPayments: (params: any) => adminApi.get('/payments', { params }),
  verifyPayment: (id: number, data: any) =>
    adminApi.put(`/verify-payment/${id}`, data),
};

export const adminReports = {
  getReports: (params: any) => adminApi.get('/reports', { params }),
  exportReport: (params: any) =>
    adminApi.get('/reports/export', {
      params,
      responseType: 'blob',
    }),
};

export const adminProfile = {
  me: () => adminApi.get('/me'),
};

export default adminApi;
