import axios from 'axios';

// Crear una instancia de Axios con la URL base
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
