import { apiClient } from "./apiClient";

export const confirmOrderCODOrder = async (orderId) => {
  return apiClient.put(`/user/orders/${orderId}/confirm-cod`, {
    paymentMethod: "cash_on_delivery",
    paymentDetails: null,
  });
};

export const createPaymentIntent = async (orderId) => {
  const data = await apiClient.post(`/payment/create-payment-intent`, {
    orderId,
  });

  return data;
};
