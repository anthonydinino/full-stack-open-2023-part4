const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const app = express();
const blogRouter = require("./controllers/blog");
const logger = require("./utils/logger");

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

app.get("/", (req, res) => {
  res.send("hello");
});

module.exports = app;
