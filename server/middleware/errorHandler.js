const notFound = (req, res, next) => {
  const error = new Error(`NOT FOUND - ${req.originalUrl}`);

  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // baseline defaults
  let status = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || undefined;

  if (err.name === "ValidationError") {
    status = 400; // client error
    errors = {};

    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    const errorMessages = Object.values(errors);
    message =
      errorMessages.length > 0 ? errorMessages.join(", ") : "Validation Failed";
  }
  res.status(status).json({
    success: false,
    status,
    message,
    ...(errors && { errors }), // include errors if there is validation error
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export { notFound, errorHandler };
