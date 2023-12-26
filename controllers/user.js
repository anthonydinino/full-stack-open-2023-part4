const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");
const helper = require("../utils/user_helper");
const { error } = require("../utils/logger");

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: true,
    title: true,
    author: true,
  });
  res.status(200).json(users);
});

userRouter.post("/", async (req, res) => {
  const { username, name, password, blogs } = req.body;

  if (username.length <= 3 || password.length <= 3) {
    res.status(400);
    throw new Error("username and password must be at least 3 characters long");
  }

  const usersInDB = (await helper.usersInDB()).map((user) => user.username);
  if (usersInDB.includes(username)) {
    res.status(409);
    throw new Error("username already exists");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    blogs,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

userRouter.delete("/", async (req, res) => {
  await User.deleteMany({});
  res.status(204);
});

userRouter.delete("/:id", async (req, res) => {
  await user.deleteOne({ _id: req.params.id });
  res.sendStatus(204);
});

userRouter.put("/:id", async (req, res) => {
  const user = {
    username: req.body.username,
    name: req.body.name,
    passwordHash: req.body.password,
  };

  const newuser = await user.findByIdAndUpdate(req.params.id, user, {
    new: true,
  });

  res.status(200).json(newuser);
});

module.exports = userRouter;
