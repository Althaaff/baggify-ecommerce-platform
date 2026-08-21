import { Router } from "express";
import authRoutes from "./user/auth.routes.js";
import addressRoutes from "./user/address.routes.js";
import userProductRoutes from "./user/product.routes.js";
import userCategoryRoutes from "./user/category.routes.js";
import userOrderRoutes from "./user/order.routes.js";
import cartRoutes from "./user/cart.routes.js";
import searchRoutes from "./user/search.routes.js";
import paymentRoutes from "./user/payment.routes.js";

import adminUserRoutes from "./admin/user.routes.js";
import adminProductRoutes from "./admin/product.routes.js";
import adminCategoryRoutes from "./admin/category.routes.js";
import adminOrderRoutes from "./admin/order.routes.js";
import adminDashboardRoutes from "./admin/dashboard.routes.js";

import uploadRoutes from "./shared/upload.routes.js";

const router = Router();

// user routes :
router.use("/auth", authRoutes);
router.use("/address", addressRoutes);
router.use("/user/products", userProductRoutes);
router.use("/user/categories", userCategoryRoutes);
router.use("/user/orders", userOrderRoutes);
router.use("/cart", cartRoutes);
router.use("/search", searchRoutes);
router.use("/payment", paymentRoutes);

// admin routes :
router.use("/admin/users", adminUserRoutes);
router.use("/admin/products", adminProductRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/orders", adminOrderRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);

// shared routes :
router.use("/upload", uploadRoutes);

export default router;
