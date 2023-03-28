const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("Connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to database"))
  .catch((err) => logger.error("Error connecting to DB", err.message));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
