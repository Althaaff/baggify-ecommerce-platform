import express from "express";
import {
  confirmOrderCODOrder,
  getOrderById,
  getOrderTrackingDetails,
  getUserOrders,
  initiateOrder,
} from "../../controllers/user/order.controller.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../controllers/admin/order.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";

const router = express.Router();
router.use(protect);

// user routes
router.post("/initiate", initiateOrder);
router.put("/:orderId/confirm-cod", confirmOrderCODOrder);
router.get("/my-orders", getUserOrders);
router.get("/:orderId", getOrderById);
router.get("/:orderId/tracking", getOrderTrackingDetails);

export default router;
