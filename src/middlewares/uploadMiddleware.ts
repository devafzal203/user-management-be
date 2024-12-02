import multer from "multer";
import { storage } from "../utils/cloudinary";

export const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."));
    }
  },
}).single("avatar");

export const uploadAvatarMiddleware = (req: any, res: any, next: any) => {
  uploadAvatar(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({
        message: "Upload error",
        error: err.message,
      });
    } else if (err) {
      res.status(400).json({
        message: "Upload error",
        error: err.message,
      });
    }
    next();
  });
};
