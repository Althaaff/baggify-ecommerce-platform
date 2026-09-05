import { apiClient } from "./apiClient.js";

const ROUTES = {
  USER: "/user/orders",
  ADMIN: "/admin/orders",
};

export const orderService = {
  // user side:
  initiateOrder: async (orderData) =>
    apiClient.post(`${ROUTES.USER}/initiate`, orderData),

  getMyOrders: async () => apiClient.get(`${ROUTES.USER}/my-orders`),

  fetchOrderDetailsService: async (orderId) =>
    apiClient.get(`${ROUTES.USER}/${orderId}`),

  // admin side:
  getAllOrders: async (params = {}) =>
    apiClient.get(`${ROUTES.ADMIN}/`, { params }),

  getOrderById: async (orderId) => apiClient.get(`${ROUTES.USER}/${orderId}`),

  getOrdersStats: async () => apiClient.get(`${ROUTES.ADMIN}/stats`),

  getOrderTracking: async (orderId) => {
    return apiClient.get(`${ROUTES.USER}/${orderId}/tracking`);
  },

  updateOrderStatus: async (orderId, status) =>
    apiClient.put(`${ROUTES.ADMIN}/${orderId}/status`, { status }),

  updatePaymentStatus: async (orderId, paymentStatus) =>
    apiClient.put(`${ROUTES.ADMIN}/${orderId}/payment-status`, {
      paymentStatus,
    }),

  updateOrderTracking: async (orderId, formData) =>
    apiClient.put(`${ROUTES.ADMIN}/${orderId}/tracking`, formData),

  deleteOrder: async (orderId) =>
    apiClient.delete(`${ROUTES.ADMIN}/${orderId}`),
};
