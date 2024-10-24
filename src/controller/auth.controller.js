// ----------------------------------------Imports-----------------------------------------------
import { asyncHandler } from "../utils/asyncHandler.js";
import { authModel } from "../model/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { saveAccessTokenToCookie } from "../utils/index.js";
import { accessTokenValidity, refreshTokenValidity } from "../utils/index.js";

// -------------------------------------------------------------------------------------------

const generateAccessAndRefreshToken = async (user_id) => {
  try {
    const user = await authModel.findById(user_id);
    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error , message: "Something went wrong during token generation" });
  }
};
// @desc - to fetch the users data
// @route - GET /auth/login
// @access - PUBLIC
export const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName && !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await authModel.findOne({ userName });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User does not exist" });
  }

  const isAuth = await user.isPasswordCorrect(password);

  if (!isAuth) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect   Password" });
  }

  // accessToken - Generating Access Token
  const { accessToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const options = {
    httpOnly: true,
    maxAge: 36000000 * 5,
    secure: true, // Only set to true in production
    sameSite: "None", // Allow cross-origin cookies
  };
  
  return res
    .status(200)
    .cookie(process.env.ACCESS_TOKEN_NAME, accessToken, options)
    .json({
      success: true,
      message: "Logged in Successfully",
      user: {
        userName: user?.userName,
      },
    });
  
});



// @desc -signup for client panel
// @route - POST /auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { password, userName } = req?.body;
  // Papaya@123
  const isUserExists = await authModel.findOne({ userName });
  if (isUserExists)
    res.status(409).json({ status: false, message: "User already Exists" });

  const hashPassword = await bcrypt.hash(password, 10);

  const savedUser = await authModel.create({
    userName: userName,
    password: hashPassword,
  });

  if (!savedUser) {
    return res
      .status(500)
      .json({ status: false, message: "User cannot be created" });
  }

  const user = await authModel.findOne({ userName }).select("-password");

  res.status(200).json({
    status: "SUCCESS",
    message: "User created successfully",
    data: user,
  });
});

// @desc - to fetch the users data
// @route - POST /auth/logout
// @access - PUBLIC
export const logout = asyncHandler(async (req, res) => {
  console.log('logging out');
  const options = {
    httpOnly: true,
    secure: true,
  };

  
  res.status(200)
  .clearCookie(process.env.ACCESS_TOKEN_NAME, options)
  .json({
    success: true,
    message: "Logged Out Successfully",
  });
});
