import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init";
import authRouter from "./auth";
import pinRouter from "./pin";
import photoRouter from "./photo";
import userRouter from "./user";

const rootRouter = express.Router();

rootRouter.use("/api-docs", swaggerUi.serve);
rootRouter.get(
  "/api-docs",
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  })
);

rootRouter.use(`/auth`, authRouter);
rootRouter.use(`/pins`, pinRouter);
rootRouter.use(`/photo`, photoRouter);
rootRouter.use(`/user`, userRouter);

export default rootRouter;
