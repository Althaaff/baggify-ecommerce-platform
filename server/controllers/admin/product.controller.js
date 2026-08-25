import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import {
  uploadSingleImage,
  deleteCloudinaryImage,
} from "../../utils/cloudinary.util.js";
import fs from "fs";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    discountPrice,
    category,
    brand,
    stock,
    sku,
    sizes = [],
    colorName = "",
    colorVariants = [],
    colors = [],
    tags = [],
    images = [],
    isFeatured = false,
    isNewArrival = false,
  } = req.body;

  // required validation
  if (!name || !price || !description || !category || !brand || !stock) {
    throw new ApiError(400, "Required fields missing");
  }

  // images validation
  if (!Array.isArray(images) || images.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  // database DB check
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  // price validation
  if (discountPrice && Number(discountPrice) >= Number(price)) {
    throw new ApiError(400, "Discount price must be less than price");
  }

  const isActiveValue = Number(stock) !== 0;

  // DB operation
  const product = await Product.create({
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    category,
    brand: brand.trim(),
    images,
    stock: Number(stock),
    sku: sku.trim().toUpperCase(),
    sizes,
    colorName,
    colorVariants,
    colors,
    tags,
    isFeatured,
    isNewArrival,
    isActive: isActiveValue,
  });

  // color variants update
  if (colorVariants.length > 0) {
    await Product.updateMany(
      { _id: { $in: colorVariants } },
      { $addToSet: { colorVariants: product?._id } },
    );
  }

  await product.populate("category", "name slug");

  // standardized success response
  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: product,
      message: "Product created successfully",
    }),
  );
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // required field validation :
  const requiredFields = ["name", "sku", "category", "price", "stock"];

  for (const field of requiredFields) {
    if (req.body[field] !== undefined) {
      const value = req.body[field];

      if (
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        throw new ApiError(
          400,
          `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`,
        );
      }
    }
  }

  const newPrice =
    req.body.price !== undefined ? req.body.price : product.price;

  console.log("newPrice", newPrice);
  const newDiscountPrice =
    req.body.discountPrice !== undefined
      ? req.body.discountPrice
      : product.discountPrice;

  if (newDiscountPrice !== undefined && newDiscountPrice >= newPrice) {
    throw new ApiError(
      400,
      "Discount price must be less than the original price",
    );
  }

  const allowUpdates = [
    "name",
    "description",
    "price",
    "discountPrice",
    "category",
    "brand",
    "images",
    "sizes",
    "colorName",
    "colorVariants",
    "colors",
    "stock",
    "sku",
    "isFeatured",
    "isNewArrival",
    "tags",
  ];

  const updates = {};

  for (let key of Object.keys(req.body)) {
    if (!allowUpdates.includes(key)) continue;

    if (typeof req.body[key] === "string" && req.body[key].trim() === "") {
      updates[key] = null;
    }

    if (key === "category") {
      const categoryExists = await Category.findById(req.body.category);

      if (!categoryExists) {
        throw new ApiError(400, "Selected category does not exist");
      }

      updates.category = categoryExists._id;
    } else {
      updates[key] =
        typeof req.body[key] === "string"
          ? req.body[key].trim()
          : req.body[key];
    }
  }

  if (updates.stock !== undefined) {
    updates.isActive = updates.stock !== 0;
  } else if (req.body.stock === undefined && product.stock !== undefined) {
    updates.isActive = product.stock !== 0;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  if (updates.sku) {
    console.log("updating sku", updates.sku);
    const skuExists = await Product.findOne({
      sku: updates.sku,
      _id: { $ne: id },
    });

    if (skuExists) {
      throw new ApiError(
        400,
        "This SKU is already assigned to another product",
      );
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: updates,
    },
    { new: true, runValidators: true },
  )
    .populate("category", "name slug")
    .populate("colorVariants", "name colorName images price stock sku");

  if (req.body.colorVariants) {
    await Product.updateMany(
      { _id: { $in: req.body.colorVariants } },
      { $addToSet: { colorVariants: product?._id } },
    );
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: updatedProduct,
      message: "Product updated successfully",
    }),
  );
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(404, "Product Id is required");
  }

  const product = await Product.findById(id).select("images");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // delete all images from cloudinary :
  const publicIds = (product.images || [])
    .map((img) => img.public_id)
    .filter(Boolean);

  // delete all images from cloudinary one by one :
  // allSettled => product deletion won't crash if 1 image deletion fails
  await Promise.allSettled(publicIds.map((pid) => deleteCloudinaryImage(pid)));

  // delete product from DB
  await Product.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Product Deleted Successfully",
    }),
  );
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const uploadPromises = req.files.map(async (file) => {
    const result = await uploadSingleImage(file.path);
    if (!result) {
      throw new ApiError(
        500,
        `Failed to upload image file: ${file.originalname}`,
      );
    }
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  });

  const uploadedImages = await Promise.all(uploadPromises).catch((error) => {
    throw new ApiError(
      500,
      error.message || "Failed to process multiple image uploads",
    );
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { images: uploadedImages },
      message: "Images uploaded successfully",
    }),
  );
});

export const updateProductImage = asyncHandler(async (req, res) => {
  const { old_public_id } = req.body;

  if (!req.file) {
    throw new ApiError(400, "New image file is required");
  }

  if (old_public_id) {
    await deleteCloudinaryImage(old_public_id).catch((error) => {
      console.error("Failed to delete old image from Cloudinary:", error);
    });
  }

  const result = await uploadSingleImage(req.file.path).catch((error) => {
    throw new ApiError(
      500,
      "Failed to upload new image to cloud storage",
      error.message,
    );
  });

  if (!result) {
    throw new ApiError(500, "Cloud storage upload returned an empty response");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      message: "Product image updated successfully",
    }),
  );
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { public_id, productId } = req.body;

  if (!public_id) {
    throw new ApiError(400, "Public ID is required");
  }

  await deleteCloudinaryImage(public_id).catch((error) => {
    throw new ApiError(
      500,
      "Failed to delete image from cloud storage",
      error.message,
    );
  });

  if (productId) {
    await Product.findByIdAndUpdate(productId, {
      $pull: { images: { public_id: public_id } },
    }).catch((error) => {
      throw new ApiError(
        500,
        "Failed to remove image reference from database",
        error.message,
      );
    });
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Image deleted successfully",
    }),
  );
});
