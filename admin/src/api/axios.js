
import axios from 'axios'

const api=axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL // backend base URL from .env
});

// // Add token automatically if exists
// 🧱 3. Add Axios Interceptor (if not already)
// In your api/axios.js file, ensure this is present:

api.interceptors.request.use((config) => {
  const aToken = localStorage.getItem("aToken");
  const dToken = localStorage.getItem("dToken");
  const token = aToken || dToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// ✅ This ensures the latest token (not possibly stale context state) is used for every request.

export default api;