import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createPhotography,
  uploadPhotographyImages,
  deletePhotography,
  updatePhotography,
} from "../controller/photography.controller.js";

const Router = express.Router();

Router.route("/").post(upload.array("images[]"), createPhotography);

Router.route("/:photographyId")
  .put(updatePhotography)
  .delete(deletePhotography);

Router.route("/images/:photographyId").patch(
  upload.array("images[]"),
  uploadPhotographyImages
);

export default Router;
