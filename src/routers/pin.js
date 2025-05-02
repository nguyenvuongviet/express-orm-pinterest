import express from "express";
import isOwner from "../common/middlewares/isOwner";
import protect from "../common/middlewares/protect";
import { pinController } from "../controllers/pin";

const pinRouter = express.Router();

// Tạo route CRUD
// pinRouter.post("/", protect, pinController.create);
pinRouter.get("/", pinController.findAll);
pinRouter.get("/:id", pinController.findOne);
// pinRouter.delete("/:id", protect, isOwner, pinController.remove);

pinRouter.get("/:id/comments", pinController.getCommentsByPinId);
pinRouter.get("/:id/saved", protect, pinController.checkSavedPin);
pinRouter.post("/:id/comments", protect, pinController.createComment);

export default pinRouter;
