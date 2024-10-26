import express from "express";
import { createFilm, updateFilm } from "../controller/film.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const Router = express.Router();

Router.route("/").post(upload.single("thumbnail"), createFilm);

Router.route("/:id").put(upload.single("thumbnail"), updateFilm);

export default Router;
