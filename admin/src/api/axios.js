
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
    const aToken = localStorage.getItem("aToken");
    const dToken = localStorage.getItem("dToken");
    const uToken = localStorage.getItem("token"); // USER TOKEN

    if (aToken) {
      config.headers.Authorization = `Bearer ${aToken}`;
    } else if (dToken) {
      config.headers.Authorization = `Bearer ${dToken}`;
    } else if (uToken) {
      config.headers.Authorization = `Bearer ${uToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Now all requests automatically send the correct token. You don’t need to pass headers manually in AdminContext.jsx or Navbar.jsx.
// Step 2: Fix AdminContext API calls
// Change your getAllDoctors and other APIs to remove manual headers:

// ✅ This ensures the latest token (not possibly stale context state) is used for every request.

export default api;