import mongoose from "mongoose";

const { Schema, model } = mongoose;

const photographySchema = new Schema(
  {
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
    thumbnail:{
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Photography", photographySchema);
