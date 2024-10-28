import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import Photography from "../model/photography.model.js";
import Media from "../model/media.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPhotography = asyncHandler(async (req, res) => {
  try {
    const { description, date, name, type } = req.body;
    if (!description || !date || !name || !type) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload images." });
    }

    const newPhotography = new Photography({ description, date, name, type });
    await newPhotography.save();

    // Upload each image to Cloudinary and save the URLs in the Media collection
    const mediaPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "photography",
      });

      fs.unlinkSync(file.path);

      return new Media({
        url: result.secure_url,
        type: "image",
        category: newPhotography._id,
        categoryModel: "Photography",
      }).save();
    });

    await Promise.all(mediaPromises);

    res.status(201).json({
      success: true,
      message: "Photography created and images uploaded successfully.",
      photography: newPhotography,
    });
  } catch (error) {
    console.error("Error creating photography:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not create photography.",
    });
  }
});

export const updatePhotography = asyncHandler(async (req, res) => {
  try {
    const { photographyId } = req.params;
    console.log(photographyId);
    const { description, date, name, type } = req.body;

    const photography = await Photography.findById(photographyId);
    if (!photography) {
      return res
        .status(404)
        .json({ success: false, message: "Photosdsdsgraphy not found." });
    }

    if (description) photography.description = description;
    if (date) photography.date = date;
    if (name) photography.name = name;
    if (type) photography.type = type;

    await photography.save();

    res.status(200).json({
      success: true,
      message: "Photography updated successfully.",
      photography,
    });
  } catch (error) {
    console.error("Error updating photography:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not update photography.",
    });
  }
});

export const uploadPhotographyImages = asyncHandler(async (req, res) => {
  try {
    const { photographyId } = req.params;
    console.log(photographyId);

    const photography = await Photography.findById(photographyId);
    if (!photography) {
      return res
        .status(404)
        .json({ success: false, message: "Photography document not found." });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload images." });
    }

    // Upload each image to Cloudinary and save the URLs in the Media collection
    const mediaPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "photography",
      });

      fs.unlinkSync(file.path);

      return new Media({
        url: result.secure_url,
        type: "image",
        category: photography._id,
        categoryModel: "Photography",
      }).save();
    });

    await Promise.all(mediaPromises);

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully.",
      photographyId: photography._id,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not upload images.",
    });
  }
});

export const deletePhotography = asyncHandler(async (req, res) => {
  const { photographyId } = req.params;

  try {
    const photography = await Photography.findByIdAndDelete(photographyId);

    if (!photography) {
      return res
        .status(404)
        .json({ success: false, message: "Photography document not found." });
    }

    res.status(200).json({
      success: true,
      message: "Photography document deleted successfully.",
      deletedId: photographyId,
    });
  } catch (error) {
    console.error("Error deleting photography:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not delete photography.",
    });
  }
});
