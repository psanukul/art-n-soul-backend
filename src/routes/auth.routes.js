import express from "express";
import { login, logout, signup } from "../controller/auth.controller.js";
import { verifyTokenMiddleware } from "../middleware/verifyToken.middleware.js";

const authRouter = express.Router();
authRouter.route("/login").post(login);
authRouter.route("/logout").post(verifyTokenMiddleware, logout);

authRouter.route("/signup").post(signup); 

export default authRouter;
 