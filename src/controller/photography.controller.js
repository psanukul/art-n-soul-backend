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

    let thumbnailUrl = null;
    if (req?.files && req.files.length > 0) {
      const thumbnailImageFile = req.files[0];
      const thumbnailImageUploadResult = await cloudinary.uploader.upload(
        thumbnailImageFile.path,
        {
          folder: "photography/thumbnails",
        }
      );

      if (
        thumbnailImageUploadResult &&
        thumbnailImageUploadResult?.secure_url
      ) {
        thumbnailUrl = thumbnailImageUploadResult.secure_url;
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to upload thumbnail image.",
        });
      }

      fs.unlinkSync(thumbnailImageFile.path);
    }

    const newPhotography = new Photography({
      description,
      date,
      name,
      type,
      thumbnail: thumbnailUrl,
    });
    await newPhotography.save();

    if (thumbnailUrl) {
      await new Media({
        url: thumbnailUrl,
        type: "image",
        category: newPhotography._id,
        categoryModel: "Photography",
      }).save();
    }

    if (req?.files && req.files.length > 1) {
      const mediaPromises = req.files.map(async (file, index) => {
        if (index === 0) return;

        try {
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
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
        }
      });

      await Promise.allSettled(mediaPromises);
    }

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
    console.log(photographyId, req.body);
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
  try {
    const { photographyId } = req.params;

    if (!photographyId) {
      return res.status(400).json({
        success: false,
        message: "Photography ID is required.",
      });
    }

    // Find the photography by ID
    const photography = await Photography.findById(photographyId);
    if (!photography) {
      return res.status(404).json({
        success: false,
        message: "Photography not found.",
      });
    }

    // Extract Cloudinary public ID from the thumbnail URL if it exists
    if (photography.thumbnail) {
      const thumbnailPublicId = photography.thumbnail.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`photography/thumbnails/${thumbnailPublicId}`);
    }

    // Find and delete all related media files
    const mediaFiles = await Media.find({ 
      category: photography._id,
      categoryModel: "Photography",
      type: "image"
    });

    const deletePromises = mediaFiles.map(async (media) => {
      const publicId = media.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`photography/${publicId}`);
      await media.deleteOne();
    });

    await Promise.all(deletePromises);

    await photography.deleteOne();

    res.status(200).json({
      success: true,
      message: "Photography and all related media files deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting photography:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not delete photography.",
    });
  }
});

export const getPhotography = asyncHandler(async (req, res) => {
  try {
    const { photographyId } = req.params;

    if (!photographyId) {
      return res.status(400).json({
        success: false,
        message: "Photography ID is required.",
      });
    }

    const photography = await Photography.findById(photographyId);

    if (!photography) {
      return res.status(404).json({
        success: false,
        message: "Photography not found.",
      });
    }

    const mediaFiles = await Media.find({
      category: photography._id,
      categoryModel: "Photography",
      type: "image",
    });

    res.status(200).json({
      success: true,
      photography,
      mediaFiles,
    });
  } catch (error) {
    console.error("Error fetching Photography:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch Photography.",
    });
  }
});

export const getPhotographies = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const Photographies = await Photography.find(
      {},
      "name description date type thumbnail"
    )
      .skip(skip)
      .limit(Number(limit));

    const totalPhotographies = await Photography.countDocuments();

    res.status(200).json({
      success: true,
      Photographies,
      pagination: {
        total: totalPhotographies,
        page: Number(page),
        pages: Math.ceil(totalPhotographies / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching Photographies:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch Photographies.",
    });
  }
});
