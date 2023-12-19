const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./list_helper.test");

mongoose.set("bufferTimeoutMS", 30000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs have an id not _id", async () => {
  const response = await api.get("/api/blogs");
  expect(response._body[0].id).toBeDefined();
});

test("making a post request creates a new blog post", async () => {
  await api
    .post("/api/blogs")
    .send({
      title: "Test Blog",
      author: "Test Author",
      likes: 14,
      url: "https://testurl.com",
    })
    .expect(201);

  const response = await api.get("/api/blogs");
  expect(response._body).toHaveLength(helper.blogs.length + 1);
});

test("if likes property is missing, default to 0", async () => {
  await api
    .post("/api/blogs")
    .send({
      title: "Test Blog",
      author: "Test Author",
      url: "https://testurl.com",
    })
    .expect(201);
  const response = await api.get("/api/blogs").expect(200);
  expect(response._body[response._body.length - 1].likes).toBe(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.blogs.map((note) => new Blog(note));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
