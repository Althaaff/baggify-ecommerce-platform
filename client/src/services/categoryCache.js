const CATEGORY_CACHE_KEY = "baggify_categories";

export const getCachedCategories = () => {
  try {
    const cached = localStorage.getItem(CATEGORY_CACHE_KEY);

    if (!cached) return [];

    const parsed = JSON.parse(cached);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read cached categories:", error);
    return [];
  }
};

export const setCachedCategories = (categories) => {
  try {
    localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(categories));

    return true;
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.warn("LocalStorage quota exceeded. Category cache skipped.");
    } else {
      console.error("Failed to cache categories:", error);
    }
    return false;
  }
};
