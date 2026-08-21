import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required !"],
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: [true, "Product description is required !"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required !"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          // if it is an update operation, extract the price from the update payload
          if (this.getUpdate) {
            const updatePayload = this.getUpdate().$set || this.getUpdate();
            const price = updatePayload.price;

            // if price is not being changed in this update request, skip schema check
            // (your controller already guarantees the final state is safe)
            if (price === undefined) return true;

            return value < price;
          }
          // if it is a normal create operation, use standard 'this.price'

          return value < this.price;
        },
        message: "Discount price must be less than original price",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
          },
          public_id: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one image is required!",
      },
    },

    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    colorName: {
      type: String,
      trim: true,
      default: "",
    },
    // Array of references to the OTHER product variants
    colorVariants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// compound Index for High-Speed Filtering
productSchema.index({ category: 1, price: 1 });

// pre-save hook for discount validation
productSchema.pre("save", function (next) {
  if (this.discountPrice !== null && this.discountPrice !== undefined) {
    if (this.discountPrice >= this.price) {
      const error = new mongoose.Error.ValidationError(this);
      error.errors.discountPrice = new mongoose.Error.ValidatorError({
        message: "Discount price must be less than original price",
        path: "discountPrice",
        value: this.discountPrice,
      });
      return next(error);
    }
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
