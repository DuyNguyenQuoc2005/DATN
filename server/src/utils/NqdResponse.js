export const sendResponse = (
  res,
  statusCode,
  {
    success = true,
    data = null,
    message = "",
    error = null
  } = {}
) => {
  return res.status(statusCode).json({
    success,
    data,
    message,
    error
  });
};