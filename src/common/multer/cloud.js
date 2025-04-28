import multer from "multer";

const uploadCloud = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default uploadCloud;
