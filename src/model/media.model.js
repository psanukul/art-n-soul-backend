import mongoose from "mongoose";

const { Schema, model } = mongoose;

const mediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"], // Indicates whether it's an image or video
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      refPath: 'categoryModel',
      required: true,
    },
    categoryModel: {
      type: String,
      required: true,
      enum: ["Photography", "Film"],
    }
  },
  { timestamps: true }
);

export default model("Media", mediaSchema);
