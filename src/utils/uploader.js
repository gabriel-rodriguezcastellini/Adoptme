import __dirname from "./index.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    let folder = "others";
    if (file.mimetype.startsWith("image/")) {
      folder = "pets";
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      folder = "documents";
    }

    const folderPath = path.join(__dirname, `../public/${folder}`);
    fs.mkdirSync(folderPath, { recursive: true });

    cb(null, folderPath);
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
