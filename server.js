import cors from "cors";
import express from "express";
import { PORT } from "./src/common/constant/app";
import { handleError } from "./src/common/helpers/error";
import logApi from "./src/common/morgan/init";
import logger from "./src/common/winston/init";
import rootRouter from "./src/routers/root";

const app = express();

// middleware
app.use(express.static("."));
app.use(express.json());
app.use(logApi());
app.use(cors({ origin: ["http://localhost:3000", "https://google.com"] }));

app.use("/api", rootRouter);
app.use(handleError);

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`, {
    tag: "SERVER",
  });
});
