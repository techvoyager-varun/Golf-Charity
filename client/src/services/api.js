import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
};

// Scores
export const scoreAPI = {
  getScores: () => api.get('/scores'),
  addScore: (data) => api.post('/scores', data),
  updateScore: (id, data) => api.put(`/scores/${id}`, data),
  deleteScore: (id) => api.delete(`/scores/${id}`),
};

// Draws
export const drawAPI = {
  getCurrent: () => api.get('/draws/current'),
  getHistory: () => api.get('/draws/history'),
  getById: (id) => api.get(`/draws/${id}`),
  simulate: (data) => api.post('/draws/simulate', data),
  publish: () => api.post('/draws/publish'),
  getWinners: (id) => api.get(`/draws/${id}/winners`),
};

// Charities
export const charityAPI = {
  getAll: (params) => api.get('/charities', { params }),
  getFeatured: () => api.get('/charities/featured'),
  getBySlug: (slug) => api.get(`/charities/${slug}`),
  create: (data) => api.post('/charities', data),
  update: (id, data) => api.put(`/charities/${id}`, data),
  delete: (id) => api.delete(`/charities/${id}`),
};

// Winners
export const winnerAPI = {
  submitProof: (data) => api.post('/winners/submit-proof', data),
  getMyWinnings: () => api.get('/winners/my-winnings'),
  getAll: () => api.get('/winners'),
  approve: (id, data) => api.put(`/winners/${id}/approve`, data),
  reject: (id, data) => api.put(`/winners/${id}/reject`, data),
  markPaid: (id) => api.put(`/winners/${id}/mark-paid`),
};

// Subscriptions
export const subscriptionAPI = {
  create: (data) => api.post('/subscriptions/create', data),
  getStatus: () => api.get('/subscriptions/status'),
  cancel: () => api.post('/subscriptions/cancel'),
  getPlans: () => api.get('/subscriptions/plans'),
};

// Admin
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getReports: () => api.get('/admin/reports'),
};

export default api;
