function notFound(req, res, next) {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
}

function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(', ') });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, error: 'Invalid ticket ID format' });
  }

  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: 'Duplicate field value' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal server error' : err.message,
  });
}

module.exports = { notFound, errorHandler };
