import { asyncHandler } from "../utils/asyncHandler.js";
import Film from "../model/film.model.js";
import Media from "../model/media.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const createFilm = asyncHandler(async (req, res) => {
 
    const { description, date, name, videoUrl } = req.body;
    if (!description || !date || !name || !videoUrl) {
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
      thumbnail: thumbnailUploadResult.secure_url,
      videoUrl,
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
});

export const updateFilm = asyncHandler(async (req, res) => {
 
    const { id } = req.params;
    const { description, date, name, videoUrl } = req.body;

    const film = await Film.findById(id);
    if (!film) {
      return res
        .status(404)
        .json({ success: false, message: "Film not found." });
    }

    film.description = description || film.description;
    film.date = date || film.date;
    film.name = name || film.name;

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
      console.log(videoUrl);
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
});

export const getFilm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Film ID is required.",
      });
    }

    const film = await Film.findById(id);

    if (!film) {
      return res.status(404).json({
        success: false,
        message: "Film not found.",
      });
    }

    const mediaFiles = await Media.find({
      category: film._id,
      categoryModel: "Film",
      type: "video",
    });

    res.status(200).json({
      success: true,
      film,
      mediaFiles,
    });
  } catch (error) {
    console.error("Error fetching film:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch film.",
    });
  }
});

export const getFilms = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const skip = (Number(page) - 1) * Number(limit);

    const films = await Film.find({}, 'name description date thumbnail videoUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalFilms = await Film.countDocuments();

    res.status(200).json({
      success: true,
      films,
      pagination: {
        total: totalFilms,
        page: Number(page),
        pages: Math.ceil(totalFilms / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching films:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not fetch films.",
    });
  }
});

export const deleteFilm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Film ID is required.",
      });
    }

    const film = await Film.findById(id);
    if (!film) {
      return res.status(404).json({
        success: false,
        message: "Film not found.",
      });
    }

    const thumbnailUrl = film.thumbnail;
    const publicId = thumbnailUrl.split("/").pop().split(".")[0]; // Assumes thumbnail URL format allows extraction

    await cloudinary.uploader.destroy(`thumbnails/${publicId}`);

    console.log('deleted ->',publicId);

    await Media.deleteMany({
      category: film._id,
      categoryModel: "Film",
    });

    await film.deleteOne();

    res.status(200).json({
      success: true,
      message: "Film and related media files deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting film:", error);
    res.status(500).json({
      success: false,
      message: "Server Error. Could not delete film.",
    });
  }
});