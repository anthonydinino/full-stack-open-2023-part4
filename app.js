const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
require("express-async-errors");
const app = express();
app.use(cors());
app.use(express.json());
const logger = require("./utils/logger");
const errorHandler = require("./utils/error_handler");
const middleware = require("./middleware");
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");

// custom middleware
app.use(middleware.tokenExtractor);

// controller middleware
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/login", loginRouter);

// connection to mongodb
const mongoose = require("mongoose");
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((e) => {
    logger.error(e.message);
  });

// error handler
app.use(errorHandler);

module.exports = app;
