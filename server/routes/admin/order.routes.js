import express from "express";
import {
  deleteOrder,
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  updateOrderTracking,
  updatePaymentStatus,
} from "../../controllers/admin/order.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";

const router = express.Router();

router.use(protect, isAdmin);

// admin routes :
router.get("/stats", getOrderStats);
router.get("/", getAllOrders);
router.put("/:orderId/status", updateOrderStatus);
router.put("/:orderId/payment-status", updatePaymentStatus);
router.put("/:orderId/tracking", updateOrderTracking);
router.delete("/:orderId", deleteOrder);

export default router;
