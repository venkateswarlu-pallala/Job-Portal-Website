const errorHandler = (err, req, res, next) => {
  // Log the error for the developer
  console.error(err.stack);

  // Set a default status code if one isn't already set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    // In development, you might want to see the stack trace
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;