import { apiClient } from "./apiClient";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchAllUsers = async () => {
  const data = await apiClient.get("/admin/users");

  return data;
};

export const createNewUser = async (userData) => {
  const data = await apiClient.post("/admin/users", userData);

  return data;
};

export const updateUserRoleService = async (userId, role) => {
  const data = await apiClient.put(`/admin/users/${userId}/role`, { role });

  return data;
};

export const deleteUserService = async (userId) => {
  const data = apiClient.delete(`/admin/users/${userId}`);

  return data;
};
