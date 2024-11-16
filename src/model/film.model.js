import mongoose from "mongoose";

const { Schema, model } = mongoose;

const filmSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["International", "Indian"],
      required: true,
    },
    thumbnail: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Film", filmSchema);
