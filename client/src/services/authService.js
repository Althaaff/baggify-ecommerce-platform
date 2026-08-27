import { apiClient } from "./apiClient";

const ROUTES = {
  USER: "/auth",
};

export const authService = {
  requestOtp: async (email) => {
    return apiClient.post(`${ROUTES.USER}/request-otp`, { email });
  },

  verifyOtp: async (email, otp) => {
    return apiClient.post(`${ROUTES.USER}/verify-otp`, { email, otp });
  },

  googleLogin: async (credential) => {
    return apiClient.post(`${ROUTES.USER}/google`, credential);
  },

  updateProfile: async (formData) => {
    return apiClient.put(`${ROUTES.USER}/profile`, formData);
  },

  logoutUser: async (onComplete) => {
    try {
      await apiClient.post(`${ROUTES.USER}/logout`);
    } catch (error) {
      console.error("error logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (typeof onComplete === "function") {
        onComplete();
      }
    }
  },
};
