import { apiClient } from "./apiClient";

const ROUTES = {
  DASHBOARD: {
    ADMIN: "/admin/dashboard",
  },
};

export const dashboardService = {
  getDashboardStats: async () => apiClient.get(`${ROUTES.DASHBOARD.ADMIN}`),
};
