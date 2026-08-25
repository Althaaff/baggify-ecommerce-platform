import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { SearchKeyword } from "../../models/searchKeyword.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: {
          suggestions: [],
          products: [],
        },
        message: "Query too short, returning empty results",
      }),
    );
  }

  const searchTerm = q.trim();
  const regex = new RegExp(searchTerm, "i");

  // search in product names ( limit 5 )
  const productSuggestions = await Product.find({
    name: regex,
  })
    .select("name")
    .limit(5)
    .lean();

  // search in categories ( limit 3 ) :
  const categorySuggestions = await Category.find({
    name: regex,
    isActive: true,
  })
    .select("name slug")
    .limit(3)
    .lean();

  // search in tags ( limit 5 ) :
  const tagSuggestions = await Product.aggregate([
    { $unwind: "$tags" }, // creates a separate copy for every item in the tags array
    { $match: { tags: regex } }, // filters documents to keep only those where the tags field matches the provided regular expression.
    { $group: { _id: "$tags" } }, // groups the remaining documents by their tags value and removes duplicates.
    { $limit: 5 }, // returns only the first 5 unique tag matches from the previous step.
  ]);

  // search in brands :
  const brandSuggestions = await Product.aggregate([
    { $match: { brand: regex } },
    { $group: { _id: "$brand" } },
    { $limit: 3 },
  ]);

  const popularSearches = await SearchKeyword.find({
    keyword: regex,
  })
    .sort({ searchCount: -1 })
    .limit(3)
    .select("keyword")
    .lean();

  // get matching products ( limit 4 for quick preview )
  const products = await Product.find({
    $or: [{ name: regex }, { brand: regex }, { tags: regex }],
  })
    .select("name images price discountPrice")
    .limit(4)
    .lean();

  // combine all suggestions :
  const suggestions = [
    ...productSuggestions.map((product) => ({
      type: "product",
      value: product.name,
    })),
    ...categorySuggestions.map((category) => ({
      type: "category",
      value: category.name,
      slug: category.slug,
    })),
    ...tagSuggestions.map((tag) => ({
      type: "tag",
      value: tag._id,
    })),
    ...brandSuggestions.map((brand) => ({
      type: "brand",
      value: brand._id,
    })),
    ...popularSearches.map((search) => ({
      type: "popular",
      value: search.keyword,
    })),
  ];

  // if index matched keep if not matched remove it :
  const uniqueSuggestions = suggestions.filter((suggestion, index, arr) => {
    return index === arr.findIndex((s) => s.value === suggestion.value);
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { suggestions: uniqueSuggestions.slice(0, 10), products: products }, // maximum 10 suggestions
      message: "Suggestions fetched successfully",
    }),
  );
});

export const trackSearch = asyncHandler(async (req, res) => {
  const { query, resultCount } = req.body;

  if (!query) {
    throw new ApiError(400, "Search query not found!");
  }

  // update or create search keyword :
  await SearchKeyword.findOneAndUpdate(
    {
      keyword: query.toLowerCase().trim(),
    },
    {
      $inc: { searchCount: 1 },
      $set: { lastSearched: new Date(), resultCount: resultCount || 0 },
    },
    { upsert: true, new: true },
  );

  return res.status(200).json({ success: true });
});
