import express from "express";
import {
  createFilm,
  updateFilm,
  getFilm,
  getFilms,
  deleteFilm,
} from "../controller/film.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const Router = express.Router();

Router.route("/").get(getFilms).post(upload.single("thumbnail"), createFilm);

Router.route("/:id")
  .get(getFilm)
  .put(upload.single("thumbnail"), updateFilm)
  .delete(deleteFilm);

export default Router;
