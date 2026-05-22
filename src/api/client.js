// src/api/client.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with base config
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — token expired
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

// ── Auth ──────────────────────────────────────
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
};

// ── Products ──────────────────────────────────
export const productsAPI = {
  getAll:   (params) => api.get('/products', { params }),
  getById:  (id)     => api.get(`/products/${id}`),
};

// ── Categories ────────────────────────────────
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

// ── Cart ──────────────────────────────────────
export const cartAPI = {
  get:    ()     => api.get('/cart'),
  add:    (data) => api.post('/cart', data),
  update: (data) => api.put('/cart', data),
  remove: (data) => api.delete('/cart', { data }),
  clear:  ()     => api.delete('/cart'),
};

// ── Orders ────────────────────────────────────
export const ordersAPI = {
  getAll:  ()     => api.get('/orders'),
  getById: (id)   => api.get(`/orders/${id}`),
  place:   (data) => api.post('/orders', data),
};

// ── Reviews ───────────────────────────────────
export const reviewsAPI = {
  getForProduct: (productId) => api.get('/reviews', { params: { product_id: productId } }),
  submit:        (data)      => api.post('/reviews', data),
};

export default api;
