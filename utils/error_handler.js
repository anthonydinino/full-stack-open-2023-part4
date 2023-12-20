const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).json({ success: false, msg: "Invalid Id format" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ success: "false", msg: error.message });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({ success: false, msg: error.message });
};

module.exports = errorHandler;
