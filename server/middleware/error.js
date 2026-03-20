const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'SERVER_ERROR';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
    code = 'VALIDATION_ERROR';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value for ${Object.keys(err.keyValue).join(', ')}`;
    code = 'DUPLICATE_KEY';
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  }

  res.status(statusCode).json({ success: false, message, code });
};

module.exports = errorHandler;
