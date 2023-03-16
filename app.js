const blogRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const config = require("./utils/config");
const express = require("express");
const app = express();
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

mongoose.set("strictQuery", false);

logger.info("Connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to database"))
  .catch((err) => logger.error("Error connecting to DB", err.message));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

module.exports = app;
