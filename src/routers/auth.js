import express from "express";
import authController from "../controllers/auth";
import protect from "../common/middlewares/protect";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authController.refreshToken);
// authRouter.get("/get-info", protect, authController.getInfo);
// authRouter.post("/google-login", authController.googleLogin);

export default authRouter;
