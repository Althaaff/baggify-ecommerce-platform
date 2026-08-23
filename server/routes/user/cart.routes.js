import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  getCartCount,
  removeFromCart,
  updateCartItemQuantity,
  reorderItems,
  mergeGuestCart,
} from "../../controllers/user/cart.controller.js";
import { optionalProtect, protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// public / hybrid routes (support both guests & authenticated users)
router.post("/add", optionalProtect, addToCart);
router.get("/", optionalProtect, getCart);
router.delete("/clear", optionalProtect, clearCart);
router.delete("/remove/:itemId", optionalProtect, removeFromCart);
router.get("/count", optionalProtect, getCartCount);
router.patch("/update/:itemId", optionalProtect, updateCartItemQuantity);

// protected routes (strictly require logged-in user)
router.post("/merge", protect, mergeGuestCart);
router.post("/reorder", protect, reorderItems);

export default router;
