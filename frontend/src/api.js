import axios from 'axios';
import { AuthContext } from './context/AuthContext';
//import React, { useContext } from 'react';

// Verificar si está en producción o desarrollo
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

// Interceptor para añadir el token a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
