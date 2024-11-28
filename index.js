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
      "https://art-and-soul-photography.vercel.app",
      "https://art-n-soul-admin.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposedHeaders: ["*", "Authorization"],
  })
);

import authRouter from "./src/routes/auth.routes.js";
import photographyRouter from "./src/routes/photography.routes.js"
import mediaRouter from "./src/routes/media.routes.js"
import filmRouter from "./src/routes/film.routes.js"
import globalRouter from "./src/routes/globalData.routes.js"

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/photography", photographyRouter);
app.use("/api/v1/media",mediaRouter)
app.use("/api/v1/film",filmRouter)
app.use("/api/v1/global",globalRouter)





app.use(error);

app.listen(PORT, () => {
  console.log(chalk.blue(`Connected to port ${process.env.PORT}`));
  mongoConnect();
});
