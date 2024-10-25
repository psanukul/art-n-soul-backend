import { asyncHandler } from "../utils/asyncHandler.js";
import Media from "../model/media.model.js";
import {deleteMediaFromCloudinary} from "../utils/cloudinary.js";


export const deleteMedia = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const resourceType = req.query.resource_type || 'image'; 
  
    try {
      const media = await Media.findById(id);
  
      if (!media) {
        return res.status(404).json({ success: false, message: "Media document not found." });
      }
  
      // Delete the media from Cloudinary using the utility function
      await deleteMediaFromCloudinary(media, resourceType);
  
      await Media.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        message: "Media document deleted successfully.",
        deletedId: id,
      });
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ success: false, message: "Server Error. Could not delete media." });
    }
  });