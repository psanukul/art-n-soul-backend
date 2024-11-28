import express from "express";
import { verifyTokenMiddleware } from "../middleware/verifyToken.middleware.js";
import {
  contact,
  deleteContact,
  getAllContacts,
} from "../controller/contact.controller.js";

const contactRouter = express.Router();

contactRouter.route("/").get(getAllContacts).post(contact);
contactRouter.route("/:id").delete(deleteContact);

export default contactRouter;
