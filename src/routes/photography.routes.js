import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createPhotography, uploadPhotographyImages } from "../controller/photography.controller.js";


const Router = express.Router();

Router.post("/",upload.array("images", 10), createPhotography);

Router.patch('/:photographyId', upload.array("images"), uploadPhotographyImages);


export default Router;
 