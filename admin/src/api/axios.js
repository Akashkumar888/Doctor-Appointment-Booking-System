
import axios from 'axios'

const api=axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL // backend base URL from .env
});

// // Add token automatically if exists
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;