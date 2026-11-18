import { env } from "../config/NqdEnv.js";
import { sendResponse } from "../utils/NqdResponse.js";

export const notFound = (req, res) => {
  return sendResponse(res, 404, {
    success: false,
    message: "Không tìm thấy tài nguyên",
    error: "NOT_FOUND"
  });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return sendResponse(res, 400, {
      success: false,
      message: "Dữ liệu JSON không hợp lệ",
      error: "INVALID_JSON"
    });
  }

  const statusCode =
    Number.isInteger(err.status) &&
      err.status >= 400 &&
      err.status < 600
      ? err.status
      : 500;

  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(err);
  }

  return sendResponse(res, statusCode, {
    success: false,
    message: isServerError
      ? "Đã xảy ra lỗi máy chủ"
      : err.message,
    error: isServerError && env.nodeEnv === "production"
      ? "INTERNAL_SERVER_ERROR"
      : err.code || "INTERNAL_SERVER_ERROR"
  });
};