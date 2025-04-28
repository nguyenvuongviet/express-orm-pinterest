import morgan from "morgan";
import logger from "../winston/init";

const logApi = (req, res) => {
  return morgan(function (tokens, req, res) {
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const status = tokens.status(req, res);
    const contentLength = tokens.res(req, res, "content-length");
    const resTime = tokens["response-time"](req, res) + "ms";

    const message = `${method} ${url} ${status} ${resTime} ${contentLength}`;

    logger.info(message, { tag: "API" });
  });
};
export default logApi;
