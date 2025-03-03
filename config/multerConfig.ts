import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image");
    const isVideo = file.mimetype.startsWith("video");

    let format: string | undefined;
    if (isImage) {
      format = "png";
    } else if (isVideo) {
      format = "mp4";
    }

    return {
      folder: "/public/storage",
      format: format,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "images", maxCount: 10 },
  { name: "video", maxCount: 1 },
]);

export default upload;
