import express from "express";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../controllers/admin/product.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";

const router = express.Router();

router.use(protect, isAdmin);

router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
