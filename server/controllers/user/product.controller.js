import mongoose from "mongoose";
import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const { in_stock, minPrice, maxPrice, sortBy, search, category, collection } =
    req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  // skip value :
  const skip = (page - 1) * limit;

  // page & limit should positive :
  if (page < 1 || limit < 1) {
    throw new ApiError(400, "Page and limit must be positive numbers");
  }

  let filter = {};
  let sort = { createdAt: -1 }; // default newest

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }
    // if not ObjectId, search by category name / slug
    else {
      const categoryDoc = await Category.findOne({
        $or: [
          {
            slug: category.toLowerCase(),
          },
          { name: { $regex: new RegExp(`^${category}$`, "i") } },
        ],
      });

      if (categoryDoc) {
        filter.category = categoryDoc?._id;
      } else {
        // Category not found - return empty results
        return res.status(200).json(
          new ApiResponse({
            statusCode: 200,
            data: {
              products: [],
              pagination: {
                currentPage: page,
                totalPages: 0,
                totalProducts: 0,
                limit,
                hasPrevPage: false,
                hasNextPage: false,
              },
            },
            message: "No products found for this category",
          }),
        );
      }
    }
  }

  // stock filter :
  if (in_stock === "true") {
    filter.stock = { $gt: 0 };
  }

  if (in_stock === "false") {
    filter.stock = { $lte: 0 };
  }

  // price filter :
  if (minPrice || maxPrice) {
    filter.$expr = {
      $and: [
        minPrice
          ? {
              $gte: [
                { $ifNull: ["$discountPrice", "$price"] }, // use discountPrice if that's not null otherwise use $price
                Number(minPrice),
              ],
            }
          : {},
        maxPrice
          ? {
              $lte: [
                { $ifNull: ["$discountPrice", "$price"] }, // use discountPrice if that's not null otherwise use $price
                Number(maxPrice),
              ],
            }
          : {},
      ].filter(Boolean),
    };
  }

  // special collection filtering:
  switch (collection) {
    case "new-launches":
      filter.createdAt = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };

      sort = { createdAt: -1 };
      break;

    default:
      break;
  }

  // sort filtering :
  switch (sortBy) {
    case "manual":
      sort = { createdAt: -1 };
      break;

    case "best-selling":
      sort = { soldCount: -1 };
      break;

    case "a-z":
      sort = { name: 1 };
      break;

    case "z-a":
      sort = { name: -1 };
      break;

    case "price-low-high":
      sort = {
        discountPrice: 1,
        price: 1,
      };
      break;

    case "price-high-low":
      sort = {
        discountPrice: -1,
        price: -1,
      };
      break;

    case "date-old-new":
      sort = {
        createdAt: 1,
      };

      break;

    case "date-new-old":
      sort = { createdAt: -1 };
      break;

    default:
      break;
  }

  // search filter :
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { sku: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
      { tags: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .populate("category", "name")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const totalProducts = await Product.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  const responseData = {
    products,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    },
  };

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: responseData,
      message: "Product fetched successfully",
    }),
  );
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featuredProducts = await Product.find({ isFeatured: true })
    .limit(8)
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        count: featuredProducts.length,
        products: featuredProducts,
      },
      message: "Fetured products fetched successfully",
    }),
  );
});

export const getNewArrivalProducts = asyncHandler(async (req, res) => {
  const newArrivalProducts = await Product.find({ isNewArrival: true })
    .limit(8)
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        count: newArrivalProducts.length,
        products: newArrivalProducts,
      },
    }),
  );
});

export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  const product = await Product.findById(productId)
    .populate({
      path: "category",
      select: "_id name slug description",
    })
    .populate({
      path: "colorVariants",
      select: "name colorName images price stock sku",
    })
    .lean();

  if (!product) {
    throw new ApiError(404, "Product not found!");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: product,
      message: "Product fetched successfully",
    }),
  );
});
