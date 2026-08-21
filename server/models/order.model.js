import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
const generateOrderNum = customAlphabet(
  "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  6,
);

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
const PAYMENT_METHODS = ["pending", "stripe", "cash_on_delivery"];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
      },
    },

    // where to ship
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: { type: Number, required: true, min: 0 },

    // payment
    paymentMethod: {
      type: String,
      required: true,
      enum: PAYMENT_METHODS,
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
    },

    paymentDetails: {
      transactionId: { type: String }, // gateway's payment ID
      paidAt: { type: Date },
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },

    trackingInfo: {
      courierName: { type: String, default: "" },
      trackingId: { type: String, default: "" },
      trackingUrl: { type: String, default: "" },
      estimatedDelivery: { type: Date },
      updates: [
        {
          status: {
            type: String,
          },

          location: {
            type: String,
          },

          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    expiresAt: {
      type: Date,
      default: undefined,
    },
    stockRestored: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

orderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${generateOrderNum()}`;
  }

  next();
});

export const Order = mongoose.model("Order", orderSchema);
