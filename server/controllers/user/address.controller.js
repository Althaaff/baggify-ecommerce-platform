import { Address } from "../../models/address.model.js";

// get all address for logged in user :
export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses ..");
    res.status(500).json({
      success: false,
      message: "failed to fetch addresses",
      error: error.message,
    });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.user._id, //ensure user only can access their own address
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
      error: error.message,
    });
  }
};

// create new address :
export const createAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      address,
      apartment,
      city,
      country,
      state,
      pinCode,
      phoneNumber,
      isDefault,
    } = req.body;

    console.log(
      "user data",
      firstName,
      lastName,
      address,
      apartment,
      city,
      country,
      state,
      pinCode,
      phoneNumber,
      isDefault
    );
    console.log("user token", req.user);

    // if this set as defaults, unset other defaults :
    // updateMany() updates multiple documents at once, unlike updateOne() which updates only one document.
    if (isDefault) {
      await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    // create new address :
    const newAddress = await Address.create({
      userId: req.user._id,
      firstName,
      lastName,
      address,
      apartment,
      city,
      country,
      state,
      pinCode,
      phoneNumber,
      isDefault: isDefault || false,
    });

    res.status(200).json({
      success: true,
      message: "Address created successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("Error creating address:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { isDefault, ...updateData } = req.body;

    // find address and verify ownership :
    let address = await Address.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found!",
      });
    }

    // if setting as default, unset other defaults
    if (isDefault && !address.isDefault) {
      await Address.updateMany(
        { userId: req.user._id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    // update address :
    address = await Address.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        isDefault: isDefault || false,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error updating address:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  console.log("user", req.user._id);
  console.log("_id", req.params.id);
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found!",
      });
    }

    res.status(200).json({
      succes: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found!",
      });
    }

    // use the schema method :
    await address.setAsDefault();

    res.status(200).json({
      success: true,
      message: "Default address set successfully",
      data: address,
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set default address",
      error: error.message,
    });
  }
};

export const deleteAllAddress = async (req, res) => {
  try {
    const result = await Address.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} addresses`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all addresses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete addresses",
      error: error.message,
    });
  }
};
