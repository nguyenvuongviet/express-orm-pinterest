export const responseSuccess = (
  data = null,
  message = "Thành công",
  statusCode = 200
) => {
  return {
    status: "success",
    statusCode,
    message,
    data,
    doc: "domain.com/docs-api",
  };
};

export const responseError = (
  message = "Internal Server Error",
  statusCode = 500,
  stack = null
) => {
  return {
    status: "error",
    statusCode,
    message,
    stack,
    doc: "domain.com/docs-api",
  };
};
