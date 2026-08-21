import mongoose from "mongoose";
import slugify from "slugify";

export const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required!"],
      trim: true,
      unique: true,
      minLength: [2, "Category name must be at least 2 characters long"],
      maxLength: [50, "Category name cannot exceed 50 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    imageId: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// create slug from name before saving :
categorySchema.pre("save", function (next) {
  console.log("this refers :", this);
  if (this.isModified("name") || !this.slug) {
    console.log("consoled", this.slug);
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

// virtual for sub categories :
categorySchema.virtual("subcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentCategory",
});

// Static method to get active categories
categorySchema.statics.getActiveCategories = function () {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Method to check if category has subcategories
categorySchema.methods.hasSubcategories = async function () {
  const count = await mongoose.model("Category").countDocuments({
    parentCategory: this._id,
    isActive: true,
  });

  return count > 0;
};

const Category = mongoose.model("Category", categorySchema);

export { Category };
