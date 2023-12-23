const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

userRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
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
