import express from "express";
import { deleteMedia } from "../controller/media.controller.js";

const Router = express.Router();

Router.route("/:id").delete(deleteMedia);

export default Router;
