import { Router } from "express";
import {
  createGridItems,
  deleteGridItem,
  getGridItems,
} from "../controller/globalData.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/image-grid")
  .post(upload.array("images"), createGridItems)
  .get(getGridItems);

router.route("/image-grid/:id").delete(deleteGridItem);

export default router;
