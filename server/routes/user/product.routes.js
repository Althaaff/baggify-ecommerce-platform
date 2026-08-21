import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getNewArrivalProducts,
} from "../../controllers/user/product.controller.js";
import { getProductById } from "../../controllers/user/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivalProducts);
router.get("/:productId", getProductById);

export default router;
