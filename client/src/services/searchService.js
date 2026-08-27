import { apiClient } from "./apiClient.js";

export const searchService = {
  getSuggestions: async (query) => {
    return apiClient.get(`/search/suggestions`, {
      params: { q: query },
    });
  },

  trackSearchService: async (payload) => {
    return apiClient.post(`/search/track`, payload);
  },
};
