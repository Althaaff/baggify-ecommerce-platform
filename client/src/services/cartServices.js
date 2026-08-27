import { apiClient } from "./apiClient.js";
export const cartApiService = {
  getCart: async () => {
    return apiClient.get("/cart");
  },

  addToCart: async (data) => {
    return apiClient.post("/cart/add", data);
  },

  removeFromCart: async (itemId) => {
    return apiClient.delete(`/cart/remove/${itemId}`);
  },

  updateItemQuantity: async (itemId, quantity) => {
    return apiClient.patch(`/cart/update/${itemId}`, { quantity });
  },

  mergeGuestCart: async () => {
    console.log("cart merge api called!");
    return apiClient.post("/cart/merge");
  },

  getCartCount: async () => {
    return apiClient.get("/cart/count");
  },

  clearCart: async () => {
    return apiClient.delete("/cart/clear");
  },

  reOrderItems: async (orderId) => apiClient.post(`/cart/reorder`, { orderId }),
};
