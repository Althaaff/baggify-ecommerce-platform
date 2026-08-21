import express from "express";
import {
  logout,
  requestOtp,
  updateProfile,
  verifyOtp,
} from "../../controllers/user/auth.controller.js";
import {
  googleCallBack,
  googleLogin,
} from "../../controllers/user/google.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";

const router = express.Router();

// email otp :
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

// update profile :
router.put("/profile", protect, updateProfile);

// google OAuth :
router.post("/google", googleLogin);
router.get("/google/callback", googleCallBack);

// logout :
router.post("/logout", logout);

// Protected route - Get current user :
router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get("/admin/dashboard", isAdmin, (req, res) => {
  res.send({ message: "welcome to admin dashboard!" });
});

export default router;
