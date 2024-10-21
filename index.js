import express from "express";
import cors from "cors";
import { mongoConnect } from "./src/config/db.js";
import dotenv from "dotenv";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import { error } from "./src/middleware/error.middleware.js";




dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposedHeaders: ["*", "Authorization"],
  })
);

import authRouter from "./src/routes/auth.routes.js";

// routes
app.use("/api/v1/auth", authRouter);





app.use(error);

app.listen(PORT, () => {
  console.log(chalk.blue(`Connected to port ${process.env.PORT}`));
  mongoConnect();
});