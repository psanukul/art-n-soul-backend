import GridItem from "../model/GridItem.model.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createGridItems = asyncHandler(async (req, res) => {
  if (!req?.files || req.files.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No files uploaded." });
  }

  const uploadPromises = req.files.map(async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "grid-items",
      });

      fs.unlinkSync(file.path);

      return new GridItem({
        imageUrl: result.secure_url,
        isActive: true,
      }).save();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  });

  const results = await Promise.allSettled(uploadPromises);

  const successfulUploads = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  res.status(201).json({
    success: true,
    message: "Grid items created and images uploaded successfully.",
    gridItems: successfulUploads,
  });
});

export const getGridItems = asyncHandler(async (req, res) => {
  console.log("im hree");
  const gridItems = await GridItem.find();

  res.status(200).json({
    success: true,
    data: gridItems,
    message: "Grid Items Fetched Successfully",
  });
});

export const deleteGridItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isDeleted = await GridItem.findByIdAndDelete(id);
  if (!isDeleted) {
    return res.status(404).json({
      success: false,
      message: "Grid Item not found.",
    });
  }
  res.status(200).json({
    success: true,
    data: {},
    message: "Grid Item Deleted Successfully",
  });
});
