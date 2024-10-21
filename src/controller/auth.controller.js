// ----------------------------------------Imports-----------------------------------------------
import { asyncHandler } from "../utils/asyncHandler.js";
import { authModel } from "../model/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { saveAccessTokenToCookie } from "../utils/index.js";
import { accessTokenValidity, refreshTokenValidity } from "../utils/index.js";

// -------------------------------------------------------------------------------------------
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
      .json({ success: false, message: "Incorrect UserName/Password" });
  }

  //matching password using bcrypt
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect UserName/Password" });
  }

  // accessToken - Generating Access Token
  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenValidity }
  );

  // Saving accessToken to the httpOnly Cookie
  saveAccessTokenToCookie(res, accessToken);

  return res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user: {
      userName: user?.userName,
    },
  });
});

// @desc - to generate a new refresh token
// @route - POST /auth/refresh
// @access - PUBLIC

export const refreshToken = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({
      success: false,
      message: "userName is required to generate Refresh Token",
    });
  }

  const user = await authModel.findOne({ userName });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User Does Not Exists" });
  }

  // clearing the existing cookie
  res.clearCookie(process.env.ACCESS_TOKEN_NAME);

  // refreshToken - generating a new refresh token with extended time
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenValidity }
  );

  // Saving refreshToken to the httpOnly Cookie
  saveAccessTokenToCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Refresh Token Generated",
  });
});

// @desc - to update the users password
// @route - PUT /auth/resetPassword
// @access - PRIVATE
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;

//     if (!email || !password || !confirmPassword) {
//       return res.status(400).json({
//         status: "FAILURE",
//         status: "Email Id, Password and Confirm Password are required",
//       });
//     }

//     const user = await authModel.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email does not exists" });
//     }

//     if (password.length < 10 || confirmPassword.length < 10) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password and Confirm Password must have length greater than or equal to 10",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Password does not match" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await authModel.findOneAndUpdate(
//       { email },
//       { password: hashedPassword },
//       { $new: true }
//     );

//     return res
//       .status(200)
//       .json({ success: true, message: "Password Updated Successfully" });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal Server Error! ${error.message}`,
//     });
//   }
// };

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
  res.clearCookie(process.env.ACCESS_TOKEN_NAME);
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});
