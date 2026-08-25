import { Category } from "../../models/category.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  deleteCloudinaryImage,
  uploadSingleImage,
} from "../../utils/cloudinary.util.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive, parentCategory, image, imageId } =
    req.body;

  // validate required fields :
  if (!name || name.trim().length === 0) {
    throw new ApiError(401, "Category name is required");
  }

  // check if category with the same name already exists :
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });

  if (existingCategory) {
    throw new ApiError(409, "Category with this name is already exist!");
  }

  // if parent category is exists validate it exists :
  if (parentCategory && parentCategory !== "null" && parentCategory !== "") {
    const parent = await Category.findById(parentCategory);
    if (!parent) {
      throw new ApiError(404, "Parent category not found");
    }
  }

  const categoryData = {
    name: name.trim(),
    description: description.trim() || "",
    isActive: isActive !== undefined ? isActive : true,
    image: image || "", // cloudinary URL
    imageId: imageId, // cloudinary public_id
  };

  if (parentCategory && parentCategory !== "null" && parentCategory !== "") {
    categoryData.parentCategory = parentCategory;
  }

  // only add parentCategory if it's a valid ObjectId:
  if (parentCategory && parentCategory !== "null" && parentCategory !== "") {
    categoryData.parentCategory = parentCategory;
  }

  const category = await Category.create(categoryData);

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: category,
      message: "Category created successfully",
    }),
  );
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, isActive, parentCategory, image, imageId } =
    req.body;

  // find category :
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // check if new name conflicts with existing category :
  if (name && name.trim().toLowerCase() !== category.name.toLowerCase()) {
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exist");
    }
  }

  // validate parent category if provided :
  if (parentCategory && parentCategory !== null && parentCategory !== "") {
    if (parentCategory === id) {
      throw new ApiError(400, "Category cannot be it's own parent");
    }

    const parent = await Category.findById(parentCategory);

    if (!parent) {
      throw new ApiError(404, "Parent Category not found");
    }

    category.parentCategory = parentCategory;
  } else if (
    parentCategory === null ||
    parentCategory === "" ||
    parentCategory === "null"
  ) {
    category.parentCategory = null;
  }

  if (
    imageId !== undefined &&
    category.imageId &&
    category.imageId !== imageId
  ) {
    await deleteCloudinaryImage(category.imageId);
  }

  if (image !== undefined) {
    category.image = image;
  }

  if (imageId !== undefined) {
    category.imageId = imageId;
  }

  if (name) category.name = name.trim();
  if (description !== undefined) category.description = description.trim();
  if (isActive !== undefined) category.isActive = Boolean(isActive);

  await category.save();

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: category,
      message: "Category updated successfully",
    }),
  );
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const hasSubcategories = await category.hasSubcategories();

  if (hasSubcategories) {
    throw new ApiError(
      400,
      "Cannot delete category with subcategories. Delete subcategories first.",
    );
  }

  // delete img from cloudinary if exists :
  if (category.image) {
    await deleteCloudinaryImage(category.imageId);
  }

  await category.deleteOne();

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "category deleted successfully",
    }),
  );
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const { isActive, parent } = req.query;

  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  if (parent === null || parent === "none") {
    filter.parentCategory = null;
  } else if (parent) {
    filter.parentCategory = parent;
  }

  const categories = await Category.find(filter)
    .populate("parentCategory", "name slug")
    .populate("subcategories")
    .sort({ name: 1 });

  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: categories,
      message: "Categories fetched successfully",
    }),
  );
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  // try to find by id first then by slug :
  const category = await Category.findById(idOrSlug)
    .populate("parentCategory", "name slug")
    .populate("subcategories");

  // if id not found in first find then try to find using slug :
  if (!category) {
    category = await Category.find({ slug: idOrSlug })
      .populate("parentCategory", "name slug")
      .populate("subcategories");
  }

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: category,
      message: "Category fetched successfully",
    }),
  );
});

export const uploadCategoryImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(401, "No file uploaded");
  }

  const result = await uploadSingleImage(req.file.path);

  if (!result) {
    throw new ApiError(500, "Failed to process image with Cloudinary");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Category Image Uploaded Succesfully",
      data: {
        image: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      },
    }),
  );
});
