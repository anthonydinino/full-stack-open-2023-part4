const User = require("../models/user");

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const userInDB = async (id) => {
  const user = await User.findById(id);
  return user.toJSON();
};

module.exports = { usersInDB, userInDB };
