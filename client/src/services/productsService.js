import { apiClient } from "./apiClient";
const API_URL = import.meta.env.VITE_API_URL;

const ROUTES = {
  PRODUCT: {
    USER: "/user/products",
    ADMIN: "/admin/products",
  },
  CATEGORY: {
    ADMIN: "/admin/categories",
    USER: "/user/categories",
  },
  UPLOAD: "/upload",
};

// optimized version
export const productService = {
  createProduct: async (formData) =>
    apiClient.post(`${ROUTES.PRODUCT.ADMIN}/create`, formData),

  updateProduct: async (id, formData) => {
    return apiClient.put(`${ROUTES.PRODUCT.ADMIN}/update/${id}`, formData);
  },

  deleteProduct: async (id) =>
    apiClient.delete(`${ROUTES.PRODUCT.ADMIN}/delete/${id}`),

  featuredProducts: async () =>
    apiClient.get(`${ROUTES.PRODUCT.USER}/featured`),

  newArrivalProducts: async () =>
    apiClient.get(`${ROUTES.PRODUCT.USER}/new-arrivals`),

  getAllProducts: async (query) =>
    apiClient.get(`${ROUTES.PRODUCT.USER}/`, { params: query }),

  getProductDetails: async (productId) =>
    apiClient.get(`${ROUTES.PRODUCT.USER}/${productId}`),
};

// Category service
export const categoryService = {
  createCategory: async (payload) =>
    apiClient.post(`${ROUTES.CATEGORY.ADMIN}/create`, payload),

  getAllCategories: async (query) =>
    apiClient.get(`${ROUTES.CATEGORY.USER}`, { params: query }),

  updateCategory: async (payload, id) => {
    return apiClient.put(`${ROUTES.CATEGORY.ADMIN}/update/${id}`, payload);
  },

  deleteCategory: async (id) => {
    return apiClient.delete(`${ROUTES.CATEGORY.ADMIN}/delete/${id}`);
  },
};

// Upload Service
export const uploadService = {
  uploadCategoryImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return apiClient.post(`${ROUTES.UPLOAD}/single`, formData, {
      headers: {
        "Content-Type": "multipart/form",
      },
    });
  },

  uploadMultipleImages: async (fileArray) => {
    const formData = new FormData();
    fileArray.forEach((file) => formData.append("images", file));

    return apiClient.post(`${ROUTES.UPLOAD}/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteImage: async (publicId, productId) => {
    return apiClient.delete(`${ROUTES.UPLOAD}/delete`, {
      data: { public_id: publicId, productId: productId },
    });
  },
};
