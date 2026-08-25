import express from "express";

import { uploadSingleImage } from "../../utils/cloudinary.util.js";

import {
  uploadSingle,
  uploadMultiple,
} from "../../middleware/upload.middleware.js";
import {
  deleteProductImage,
  updateProductImage,
  uploadMultipleImages,
} from "../../controllers/admin/product.controller.js";
import { uploadCategoryImage } from "../../controllers/admin/category.controller.js";

const router = express.Router();

router.post("/single", uploadSingle, uploadCategoryImage);
router.post("/multiple", uploadMultiple, uploadMultipleImages);
router.delete("/delete", deleteProductImage);
router.put("/update", uploadSingle, updateProductImage);

export default router;
