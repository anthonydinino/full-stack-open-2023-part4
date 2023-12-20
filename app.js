const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
require("express-async-errors");
const app = express();
const blogRouter = require("./controllers/blog");
const logger = require("./utils/logger");
const errorHandler = require("./utils/error_handler");

app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((e) => {
    logger.error(e.message);
  });

app.use("/api/blogs", blogRouter);
app.use(errorHandler);

module.exports = app;
