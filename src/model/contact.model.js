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
    aboutWedding: {
      type: String,
      maxLength: 1000,
      required: [true, "About Wedding is required"],
    },
    guestCount: {
      type: Number,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    eventDate: {
      type: Date,
      required: [true, "Event Date is required"],
    },
    serviceType:{
      type:String,
      required:[true,"Service type is required"]
    }

  },
  { timestamps: true }
);

export const contactModel = mongoose.model(
  "contacts",
  contactSchema,
  "contacts"
);