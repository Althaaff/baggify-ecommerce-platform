import mongoose from "mongoose";

const searchKeywordSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    searchCount: {
      type: Number,
      default: 0,
    },

    resultCount: {
      type: Number,
      default: 0,
    },

    lastSearched: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// index for fast searching :
searchKeywordSchema.index({ keyword: "text", searchCount: -1 });

const SearchKeyword = mongoose.model("SearchKeyword", searchKeywordSchema);
export { SearchKeyword };
