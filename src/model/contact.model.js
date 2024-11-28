import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
    },
    email: {
      type: String,
      required: [true, "E-Mail is required"],
    },
    message: {
      type: String,
      maxLength: 1000,
      required: [true, "Message is required"],
    },
  },
  { timestamps: true }
);

export const contactModel = mongoose.model(
  "contacts",
  contactSchema,
  "contacts"
);