import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// google login ( client side credentials )
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Credential required");
  }

  // verify google token :
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub: googleId, email, name, picture } = ticket.getPayload();

  // find or create user :
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      profilePicture: picture,
      googleId,
      loginMethod: "google",
      isVerified: true,
      role: "user",
    });
  } else {
    user.name = user.name || name;
    user.email = user.email || email;
    user.profilePicture = user.profilePicture || picture;
    user.googleId = user.googleId || googleId;
    user.isVerified = true;
    user.loginMethod = "google";
    if (!user.role) {
      user.role = "user";
    }
    await user.save();
  }

  // generate token :
  const token = generateToken(user._id);

  // set cookie :
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Google login Successfull",
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
    }),
  );
});

// google callback ( server side redirect )
export const googleCallBack = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) throw new ApiError(400, "Authorization code required");

  // exchange code for tokens :
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  // Get user info
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub: googleId, email, name, picture } = ticket.getPayload();

  // find or create user :
  const user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      profilePicture: picture,
      googleId,
      loginMethod: "google",
      isVerified: true,
    });
  } else {
    user.googleId = user.googleId || googleId;
    user.name = user.name || name;
    user.profilePicture = user.profilePicture || picture;
    user.isVerified = true;
    user.loginMethod = "google";
    await user.save();
  }

  // generate token :
  const token = generateToken(user._id);

  // set cookie :
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // redirect to frontend :
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});
