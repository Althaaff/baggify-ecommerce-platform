import express from "express";

import {
  createUser,
  updateUserRole,
  deleteUser,
  getAllUsers,
} from "../../controllers/admin/user.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";

const router = express.Router();

// user logged in + role is admin
router.use(protect, isAdmin);

router.get("/", getAllUsers);
router.post("/", createUser);
// customer <==> administrator
router.put("/:userId/role", updateUserRole);
router.delete("/:userId", deleteUser);

export default router;
