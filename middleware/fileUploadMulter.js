const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10485760 }, // 10MB max size (example value)
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
  
    const allowedImageExtensions = [".jpg", ".jpeg", ".webp", ".png", ".jfif"];
    const allowedVideoExtensions = [".mp4", ".webm", ".ogg"];
  
    if (allowedImageExtensions.includes(ext) || allowedVideoExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}`));
    }
  }
  
});

module.exports = upload;

