/**
 * TODO: Global error handler
 *
 * Handle different error types:
 *
 * 1. Multer file size error (err.code === 'LIMIT_FILE_SIZE'):
 *    - Return 400 with { error: { message: 'File size exceeds 5MB limit' } }
 *
 * 2. Multer file type error (err.message includes 'Invalid file type'):
 *    - Return 400 with { error: { message: err.message } }
 *
 * 3. Mongoose validation error (err.name === 'ValidationError'):
 *    - Extract messages from err.errors
 *    - Return 400 with { error: { message: 'combined messages' } }
 *
 * 4. Mongoose duplicate key error (err.code === 11000):
 *    - Return 409 with { error: { message: 'Resource already exists' } }
 *
 * 5. Default error:
 *    - Return status from err.status or 500
 *    - { error: { message: err.message || 'Internal server error' } }
 */
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Internal server error";

  if (err.code === "LIMIT_FILE_SIZE") {
    status = 400;
    message = "File size exceeds 5MB limit";
  }

  if (err.message.includes("Invalid file type")) {
    status = 400;
    message = err.message;
  }

  if (err.name === "ValidationError") {
    status = 400;
    let errorMessages = Object.values(err.errors).map((e) => e.message);
    message = errorMessages.join("\n");
  }

  if (err.code === 11000) {
    status = 409;
    message = "Resource already exists";
  }

  return res.status(status).json({ error: { message } });
}
