import axios from "axios";
import { getOrCreateGuestSessionId } from "../utils/guestSession";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adds token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // always attach guest session ID :
    const guestSessionId = getOrCreateGuestSessionId();
    config.headers["x-guest-session-id"] = guestSessionId;

    return config;
  },
  (error) => Promise.reject(error),
);

// Return only backend data
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const backendMessage =
      error.response?.data?.message || "Something went wrong";

    error.message = backendMessage;
    return Promise.reject(error);
  },
);

export { apiClient };
