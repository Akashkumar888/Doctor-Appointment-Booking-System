import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // backend base URL from .env
});

// 🔹 REQUEST INTERCEPTOR - Attach token automatically before every request
api.interceptors.request.use(
  (config) => {
    const role = localStorage.getItem("role");
    let token = null;

    if (role === "admin") {
      token = localStorage.getItem("aToken");
    } else if (role === "doctor") {
      token = localStorage.getItem("dToken");
    } else {
      token = localStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🔹 RESPONSE INTERCEPTOR - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthRoute = url.includes("/login") || url.includes("/register");

    if (status === 401 && !isAuthRoute) {
      const role = localStorage.getItem("role");

      if (role === "admin") {
        localStorage.removeItem("aToken");
      } else if (role === "doctor") {
        localStorage.removeItem("dToken");
      } else {
        localStorage.removeItem("token");
      }

      localStorage.removeItem("role");
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

// ✅ Now all requests automatically send the correct token. You don’t need to pass headers manually in AdminContext.jsx or Navbar.jsx.
// Step 2: Fix AdminContext API calls
// Change your getAllDoctors and other APIs to remove manual headers:

// ✅ This ensures the latest token (not possibly stale context state) is used for every request.

export default api;
