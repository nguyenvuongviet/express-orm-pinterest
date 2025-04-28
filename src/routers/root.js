import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init";
import demoRouter from "./demo";
import authRouter from "./auth";

const rootRouter = express.Router();

rootRouter.use("/api-docs", swaggerUi.serve);
rootRouter.get(
  "/api-docs",
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  })
);

rootRouter.use(`/demo`, demoRouter);
rootRouter.use(`/auth`, authRouter);

export default rootRouter;
