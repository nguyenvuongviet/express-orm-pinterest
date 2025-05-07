import express from "express";
import uploadCloud from "../common/multer/cloud";
import protect from "../common/middlewares/protect";
import photoController from "../controllers/photo";

const photoRouter = express.Router();
// Tạo route CRUD
photoRouter.post(
  "/upload-images",
  protect,
  uploadCloud.single("avatar"),
  photoController.create
); // thêm 1 cảnh của người dùng

photoRouter.get("/pagination", photoController.findAll); // Get toàn bộ ảnh (có phân trang)
photoRouter.get("/:id", photoController.findOne); // Lấy ảnh theo ID của ảnh
photoRouter.get("/:id/saved", photoController.savedImage); // Lấy ảnh theo ID của ảnh người dùng đã lưu

photoRouter.delete("/:id", protect, photoController.remove); // Xóa ảnh theo ID của ảnh
photoRouter.post("/:id/save", protect, photoController.saveImage); // Lưu ảnh theo ID của ảnh vào người dùng đang đang nhập
photoRouter.delete("/:id/save", protect, photoController.unSaveImage);  // Hủy lưu ảnh theo ID của ảnh từ người dùng đang đang nhập

export default photoRouter;
