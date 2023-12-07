const app = require("./app");
const logger = require("./utils/logger");
const config = require("./utils/config");
const blogRouter = require("./controllers/blog");
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

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
