import chalk from "chalk";
import winston from "winston";

const colorLevels = (level) => {
  switch (level) {
    case "error":
      return chalk.redBright(level.toUpperCase());
    case "warn":
      return chalk.yellowBright(level.toUpperCase());
    case "info":
      return chalk.greenBright(level.toUpperCase());
    case "http":
      return chalk.cyanBright(level.toUpperCase());
    case "verbose":
      return chalk.magentaBright(level.toUpperCase());
    case "debug":
      return chalk.blueBright(level.toUpperCase());
    case "silly":
      return chalk.gray(level.toUpperCase());
    default:
      return level.toUpperCase();
  }
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(({ level, message, timestamp, tag }) => {
    tag = chalk.blueBright(tag || "SYSTEM");
    const levelColor = colorLevels(level);
    return `${timestamp}\t${levelColor}\t${tag}\t${message}`;
  })
);

const logger = winston.createLogger({
  level: "info", // sẽ log ra tất cả các log có level >= info (theo bậc ưu tiên: error, warn, info, http, verbose, debug, silly)
  format: winston.format.json(), // định dạng log ra file là json
  defaultMeta: { tag: "SYSTEM" }, // thêm thông tin tag vào mỗi log

  // Nơi lưu log đến (file, console,...)
  transports: [
    // Console:: Ghi log ra console
    new winston.transports.Console({
      format: consoleFormat,
    }),

    //FILE:: Ghi log là error ra file error
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),

    //FILE:: Ghi tất cả log ra file combined.log
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
