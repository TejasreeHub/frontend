import axios, { AxiosResponse } from 'axios';
import { User, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for input sanitization
api.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = sanitizeRequestData(config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Bad request');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
);

const sanitizeRequestData = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeRequestData(data[key]);
      }
    }
    return sanitized;
  }
  
  return data;
};

export const userApi = {
  createUser: async (user: User): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/users', user);
    return response.data;
  },

  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, user: User): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/users/${id}`);
    return response.data;
  },
};