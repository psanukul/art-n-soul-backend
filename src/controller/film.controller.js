import { asyncHandler } from "../utils/asyncHandler.js";
import Film from "../model/film.model.js";
import Media from "../model/media.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const createFilm = asyncHandler(async (req, res) => {
  try {
    const { description, date, name, type, videoUrl } = req.body;
    if (!description || !date || !name || !type || !videoUrl) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a thumbnail image." });
    }

    const thumbnailUploadResult = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "thumbnails",
      }
    );

    fs.unlinkSync(req.file.path);

    const newFilm = new Film({
      description,
      date,
      name,
      type,
      thumbnail: thumbnailUploadResult.secure_url,
    });

    await newFilm.save();

    await new Media({
      url: videoUrl,
      type: "video",
      category: newFilm._id,
      categoryModel: "Film",
    }).save();

    res.status(201).json({
      success: true,
      message: "Film created and media files added successfully.",
      film: newFilm,
    });
  } catch (error) {
    console.error("Error creating film:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not create film.",
    });
  }
});

export const updateFilm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { description, date, name, type, videoUrl } = req.body;

    const film = await Film.findById(id);
    if (!film) {
      return res
        .status(404)
        .json({ success: false, message: "Film not found." });
    }

    film.description = description || film.description;
    film.date = date || film.date;
    film.name = name || film.name;
    film.type = type || film.type;

    if (req.file) {
      const thumbnailUploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "thumbnails",
        }
      );

      // Remove the old thumbnail (if any) and update the thumbnail URL
      fs.unlinkSync(req.file.path);
      film.thumbnail = thumbnailUploadResult.secure_url;
    }

    await film.save();

    if (videoUrl) {
        console.log(videoUrl)
      await Media.findOneAndUpdate(
        { category: film._id, categoryModel: "Film", type: "video" },
        { url: videoUrl },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Film updated successfully.",
      film,
    });
  } catch (error) {
    console.error("Error updating film:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not update film.",
    });
  }
});
