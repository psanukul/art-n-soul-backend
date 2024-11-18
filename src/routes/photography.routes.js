import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createPhotography,
  uploadPhotographyImages,
  deletePhotography,
  updatePhotography,
  getPhotographies,
  getPhotography,
} from "../controller/photography.controller.js";

const Router = express.Router();

Router.route("/")
.get(getPhotographies)
.post(upload.array("images[]"), createPhotography);

Router.route("/:photographyId")
  .get(getPhotography)
  .put(upload.single("thumbnail"),updatePhotography)
  .delete(deletePhotography);

Router.route("/images/:photographyId").patch(
  upload.array("images[]"),
  uploadPhotographyImages
);

export default Router;
