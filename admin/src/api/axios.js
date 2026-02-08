
import axios from 'axios'

const api=axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL // backend base URL from .env
});

// // Add token automatically if exists
// 🧱 3. Add Axios Interceptor (if not already)
// In your api/axios.js file, ensure this is present:

// 🔹 Attach token automatically before every request
// 🔹 Interceptor → Runs before every API request
api.interceptors.request.use(
  (config) => {
    const role = localStorage.getItem("role");

    const tokenMap = {
      admin: localStorage.getItem("aToken"),
      doctor: localStorage.getItem("dToken"),
      user: localStorage.getItem("token"),
    };

    const token = tokenMap[role];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
   → Handle token expiry (401)
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.clear();

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


// ✅ Now all requests automatically send the correct token. You don’t need to pass headers manually in AdminContext.jsx or Navbar.jsx.
// Step 2: Fix AdminContext API calls
// Change your getAllDoctors and other APIs to remove manual headers:

// ✅ This ensures the latest token (not possibly stale context state) is used for every request.

export default api;