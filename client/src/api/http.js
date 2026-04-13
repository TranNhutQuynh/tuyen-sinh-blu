import axios from "axios";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);

  if (token) {
    config.headers.Authorization=`Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_USER_KEY);

      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default http;
