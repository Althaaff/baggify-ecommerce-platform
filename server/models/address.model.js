import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true, // for faster queries //
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    apartment: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    pinCode: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } //automatically adds created At and updated At
);

// ensure only one default address per user
// method to set this address as a default address :
addressSchema.methods.setAsDefault = async function () {
  // Unset all other addresses for this user

  //  find ALL other addresses of this user (EXCEPT current one)
  //  and set their isDefault to false
  await this.constructor.updateMany(
    {
      userId: this.userId, // same user
      _id: { $ne: this._id }, // but not the current address (this._id is current address ID)
    },
    { isDefault: false }
  );

  console.log("this context", this);

  this.isDefault = true;

  await this.save();
};

const Address = mongoose.model("Address", addressSchema);

export { Address };
