// services/api.js
import axios from 'axios';

// Cambia esto al puerto correcto donde corre tu backend
const API_URL = import.meta.env.VITE_API_URL || 'http://3.145.28.63:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Items endpoints
export const itemsAPI = {
  getAll: () => api.get('/items/'),
  getByList: (listId) => api.get(`/items/list/${listId}`), // NUEVO
  create: (data) => api.post('/items/', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  markPurchased: (id, purchased) => api.patch(`/items/${id}/purchase`, { purchased }),
};

// Stats endpoints
export const statsAPI = {
  getStats: () => api.get('/stats/'),
};

// Shopping Lists endpoints
export const listsAPI = {
  getAll: () => api.get('/lists/'),
  getById: (id) => api.get(`/lists/${id}`),
  create: (data) => api.post('/lists/', data),
  update: (id, data) => api.put(`/lists/${id}`, data),
  delete: (id) => api.delete(`/lists/${id}`),
};

export default api;