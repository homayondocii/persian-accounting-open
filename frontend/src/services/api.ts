import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API functions
export const apiGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.get(url);
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await api.post(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await api.put(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.delete(url);
  return response.data;
};

export default api;