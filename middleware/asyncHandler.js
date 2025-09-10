/**
 * Async handler wrapper to automatically catch async errors
 * and pass them to the error handling middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { asyncHandler };