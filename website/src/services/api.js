import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/user/login', credentials),
  register: (userData) => api.post('/user/register', userData),
};

// Products API calls
export const productsAPI = {
  getAllProducts: () => api.get('/products'),
  searchProducts: (params) => api.get('/products/search', { params }),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Categories API calls
export const categoriesAPI = {
  getAllCategories: () => api.get('/category'),
  createCategory: (categoryData) => api.post('/category', categoryData),
  updateCategory: (id, categoryData) => api.put(`/category/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/category/${id}`),
};

export default api;
