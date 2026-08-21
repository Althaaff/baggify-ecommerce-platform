import express from "express";
import {
  createPaymentIntent,
  getStripeConfig,
} from "../../controllers/user/payment.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/config", getStripeConfig);

// create payment intent:
router.post("/create-payment-intent", protect, createPaymentIntent);

export default router;
