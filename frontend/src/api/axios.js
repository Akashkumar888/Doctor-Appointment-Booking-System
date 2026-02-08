

// import axios from 'axios'

// const api=axios.create({
//   baseURL:import.meta.env.VITE_BACKEND_URL, // ❌ should be `baseURL`, not `url`
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

// Instead, they:
// Create a pre-configured Axios instance in /api/axios.js.
// Sometimes add interceptors to attach the JWT token automatically.
// Use that Axios instance inside a context (like your AppContext) or a service layer (like /services/authService.js).
// src/api/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // 🔐 Skip redirect for auth routes
    const isAuthRoute =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register");

    if (status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      window.location.replace("/login"); // safer than href
    }

    return Promise.reject(error);
  }
);

export default api;



// Now you don’t need to manually add headers like:
// headers: { Authorization: `Bearer ${token}` }
// Axios does it automatically before each request — clean and professional ✅