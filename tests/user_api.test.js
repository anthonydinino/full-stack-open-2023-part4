const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("../utils/user_helper");
const supertest = require("supertest");
const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("if username already exists", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "root",
      name: "Root User",
      password: "sekret",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("if not 3 minimum characters for username and password", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      username: "ro",
      name: "Root User",
      password: "sekret",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
