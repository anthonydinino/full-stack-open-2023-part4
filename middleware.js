const jwt = require("jsonwebtoken");
const User = require("./models/user");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken) {
    res.status(401);
    throw new Error("token invalid");
  }
  req.user = await User.findById(decodedToken.id);
  next();
};

module.exports = {
  tokenExtractor,
  userExtractor,
};
