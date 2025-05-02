import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init";
import authRouter from "./auth";
import pinRouter from "./pin";

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

export default rootRouter;
