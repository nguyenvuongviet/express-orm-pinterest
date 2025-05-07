import express from "express";
import userController from "../controllers/user";
import protect from "../common/middlewares/protect";

const userRouter = express.Router();

userRouter.post("/", protect, userController.create); // Tạo người dùng mới
userRouter.get("/", protect, userController.findAll); // Lấy tất cả người dùng (có phân trang)
userRouter.get("/saved-image", protect, userController.saveImage);  // Lấy ảnh người dùng đang lưu theo ID người dùng
userRouter.get("/:id", userController.findOne); // Lấy người dùng theo ID (có ảnh đã tạo của người dùng)
userRouter.put("/:id", protect, userController.update); // Cập nhật người dùng
userRouter.delete("/:id", protect, userController.remove); // Xóa người dùng theo ID

export default userRouter;
