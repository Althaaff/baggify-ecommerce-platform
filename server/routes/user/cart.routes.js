import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  getCartCount,
  removeFromCart,
  updateCartItemQuantity,
  reorderItems,
} from "../../controllers/user/cart.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/clear", clearCart);
router.delete("/remove/:itemId", removeFromCart);
router.get("/count", getCartCount);
router.patch("/update/:itemId", updateCartItemQuantity);
router.post("/reorder", reorderItems);

export default router;
