

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

// ✅ Create a pre-configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // this MUST match the backend CORS credentials:true
});

// Attach token automatically if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api; // ✅ make sure this line is present

// Now you don’t need to manually add headers like:
// headers: { Authorization: `Bearer ${token}` }
// Axios does it automatically before each request — clean and professional ✅