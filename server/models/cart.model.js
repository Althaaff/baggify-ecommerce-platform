import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product Id is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be atleast 1"],
      max: [100, "Quantity cannot exceed 100"],
      default: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be whole number",
      },
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price is cannot be negative"],
      validate: {
        validator: function (value) {
          // Validate price has max 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: "Price can have maximum 2 decimal places",
      },
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },

    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },

    productSnapshot: {
      name: String,
      image: String,
      sku: String,
    },

    // when item is added to cart :
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
      validate: {
        validator: function (items) {
          return items.length <= 50;
        },
        message: "Cart cannot contain more than 50 different items",
      },
    },

    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxLength: [20, "Coupon code cannot exceed 20 characters"],
    },

    couponDiscount: {
      type: Number,
      min: [0, "Coupon discount cannot be negative"],
      default: 0,
    },

    couponDiscountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    status: {
      type: String,
      enum: {
        values: ["active", "abandoned", "converted", "merged"],
        message: "Status {VALUE} is not valid",
      },
      default: "active",
      index: true,
    },

    currency: {
      type: String,
      uppercase: true,
      default: "INR",
      enum: ["USD", "EUR", "GBP", "CAD", "AUD", "INR"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    collection: "carts",
  },
);

// ensures a user can only have ONE active cart at a time
CartSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      userId: { $type: "objectId" },
      status: "active",
    },
  },
);

// ensures a guest session can only have ONE active cart at a time
CartSchema.index(
  { sessionId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sessionId: { $type: "string" },
      status: "active",
    },
  },
);

// speeds up abandoned cart queries and activity tracking
CartSchema.index({ status: 1, lastActivityAt: -1 });

// speeds up inventory checks and product queries inside cart arrays
CartSchema.index({ "items.productId": 1 });

const Cart = mongoose.model("Cart", CartSchema);

export { Cart };
