import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Upload the buffered image to Cloudinary before the controller runs.
export const uploadProductImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next();
  }

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "keyverse/products",
      resource_type: "image",
    },
    (error, result) => {
      if (error || !result) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({
          message: "Failed to upload product image.",
        });
      }

      req.file!.path = result.secure_url;
      next();
    }
  );

  stream.end(req.file.buffer);
};

export default upload;