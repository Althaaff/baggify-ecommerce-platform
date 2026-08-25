import multer from "multer";

const storage = multer.diskStorage({});

// allowed MiMe types :
const allowedTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",

  // PDF
  "application/pdf",

  // Videos
  "video/mp4",
  "video/mpeg",
  "video/quicktime",

  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",

  // Zip & compressed files
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept the file
  } else {
    // reject the file :
    cb(
      new Error(
        "Unsupported file type! Allowed: Images, PDFs, Videos, Audio, ZIP/RAR"
      ),
      false
    );
  }
};

// file size limit (example 20 mb):
const limits = { fileSize: 20 * 1024 * 1024 }; // 20 mb

// single file :
export const uploadSingle = multer({ storage, fileFilter, limits }).single(
  "image"
);

// multiple images :
export const uploadMultiple = multer({ storage, fileFilter, limits }).array(
  "images",
  10
);
