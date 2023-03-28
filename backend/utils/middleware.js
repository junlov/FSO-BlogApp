const logger = require("./logger");

//
// * Unknown Endpoint Middleware
//
//
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

//
// * Error Handler Middleware
//
//
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  next(error);
};

//
//
// * Request Logger Middlware
//
//
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:", request.path);
  logger.info("Body:", request.body);
  logger.info("----");
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
