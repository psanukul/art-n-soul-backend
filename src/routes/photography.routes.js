import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createPhotography,
  uploadPhotographyImages,
  deletePhotography,
} from "../controller/photography.controller.js";

const Router = express.Router();

Router.route("/").post(upload.array("images[]"), createPhotography);

Router.route("/:photographyId")
  .patch(upload.array("images"), uploadPhotographyImages)
  .delete(deletePhotography);

export default Router;
