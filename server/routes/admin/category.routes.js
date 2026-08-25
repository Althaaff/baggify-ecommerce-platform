import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../controllers/admin/category.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";
import { uploadSingle } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post("/create", protect, isAdmin, uploadSingle, createCategory);

router.put("/update/:id", protect, isAdmin, uploadSingle, updateCategory);

router.delete("/delete/:id", protect, isAdmin, deleteCategory);

export default router;
