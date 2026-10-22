import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext !== ".xlsx" && ext !== ".xls") {
    return cb(new Error("Only Excel files are allowed."));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;