import { User } from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const allowedRoles = ["customer", "admin"];

  if (role && !allowedRoles.includes(role)) {
    throw new ApiError(
      400,
      "Role must be either 'customer' or 'administrator'",
    );
  }

  const normalizedRole = role === "admin" ? "admin" : "user";

  // check if email already exist :
  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // split name into first/last:
  const [firstName, ...rest] = name.trim().split(" ");
  const lastName = rest.join(" ");

  const newUser = await User.create({
    name,
    firstName,
    lastName,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: normalizedRole,
    loginMethod: "email",
    isVerified: true, // admin created users -- dont need otp verification
  });

  const userResponse = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: { user: userResponse },
      message: "user created successfully",
    }),
  );
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -otp -otpExpiry")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse({ statusCode: 200, data: { users } }));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "admin"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "role must be either 'customer' or 'admin'");
  }

  if (req.user._id.toString() === userId && role !== "admin") {
    throw new ApiError(400, "you cannot remove your own admin access");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: role },
    { new: true },
  ).select("-password -otp -otpExpiry");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: { user },
      message: "User role updated successfully",
    }),
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() === userId) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "user deleted successfully",
    }),
  );
});
