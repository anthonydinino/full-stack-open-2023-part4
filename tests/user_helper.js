const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const userInDB = async (id) => {
  const user = await User.findById(id);
  return user.toJSON();
};

const loginUser = async (api, username, password) => {
  const response = await api.post("/api/login").send({
    username,
    password,
  });
  return response.body.token;
};

const decodedJwtToken = async (jwtToken) => {
  return await jwt.verify(jwtToken, process.env.SECRET);
};

const getTestUsers = async () => [
  {
    username: "jsmith",
    passwordHash: await bcrypt.hash("password", 10),
    blogs: [new mongoose.Types.ObjectId("5a422aa71b54a676234d17f8")],
  },
  {
    username: "aperry",
    passwordHash: await bcrypt.hash("password", 10),
  },
];

module.exports = {
  usersInDB,
  userInDB,
  loginUser,
  decodedJwtToken,
  getTestUsers,
};
