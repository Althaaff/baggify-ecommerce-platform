import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { sendOtpEmail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// generate 6-digit otp :
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// generate JWT token :
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// request otp :
export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // validate :
  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email");
  }

  // generate OTP :
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // create / update user :
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      otp: hashedOtp,
      otpExpiry,
      loginMethod: "email",
      role: "user", // default roleis set user for new users
    });
  } else {
    user.otp = hashedOtp;
    user.otpExpiry = otpExpiry;
    await user.save();
  }

  // send otp to email :
  await sendOtpEmail(email, otp);

  return res.json(
    new ApiResponse({ statusCode: 200, message: "OTP sent to email!" }),
  );
});

// verify otp :
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  console.log("email otp", email, otp);

  // validate :
  if (!email || !otp) throw new ApiError(400, "Email and Otp required!");

  // find user :
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found!");

  if (!user.otp || !user.otpExpiry) {
    throw new ApiError(400, "No OTP found. Request new one");
  }

  // check expiry :
  if (new Date() > user.otpExpiry) {
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    throw new ApiError(400, "OTP expired. Request new one");
  }

  // verify otp :
  const isValid = await bcrypt.compare(otp, user.otp);
  if (!isValid) {
    throw new ApiError(400, "Invalid Otp!");
  }
  // clear otp and mark verified :
  user.otp = null;
  user.otpExpiry = null;
  user.isVerified = true;
  await user.save();

  // generate token :
  let token = generateToken(user._id);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          profilePicture: user.profilePicture,
          isVerified: user.isVerified,
          role: user.role,
        },
      },
      message: "Login Successfull",
    }),
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;

  // get user id from authentication middleware
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName: firstName || "",
        lastName: lastName || "",
      },
    },
    { new: true, runValidators: true, select: "-otp" },
  );

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      message: "User Profile updated successfully",
    }),
  );
});

// get current user profile (for role check in frontend)
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-otp otpExpiry");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          role: user.role,
          loginMethod: user.loginMethod,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      message: "User Profile fetched successfully",
    }),
  );
});

// user logout
export const logout = asyncHandler(async (req, res) => {
  // if using cookies clear them :
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});
