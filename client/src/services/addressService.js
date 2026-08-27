import { apiClient } from "./apiClient.js";

// services :
// get all addresses :
export const getAllAddresses = async () => {
  return apiClient.get("/address/addresses");
};

// get single address :
export const getAddressById = async (id) => {
  return apiClient.get(`/address/addresses/${id}`);
};

// create address :
export const createAddress = async (addressData) => {
  return apiClient.post("/address/addresses", addressData);
};

// update address :
export const updateAddress = async (id, addressData) => {
  return apiClient.put(`/address/addresses/${id}`, addressData);
};

// delete address :
export const deleteAddress = async (id) => {
  return apiClient.delete(`/address/addresses/${id}`);
};

// set default address :
export const setDefaultAddress = async (id) => {
  return apiClient.patch(`/address/addresses/${id}/default`);
};

// delete all addresses :
export const deleteAllAddress = async () => {
  return apiClient.delete("/address/addresses/all");
};

/*

 *using axios instead of fetch() api (advantages)*

 No need for JSON.stringify() - Axios does it automatically

 No need to manually check response.ok - Axios handles errors

 Much cleaner syntax with HTTP methods as functions

 Uses interceptors for automatic token handling

*/
