const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("../utils/blog_helper");

mongoose.set("bufferTimeoutMS", 30000);

describe("when there is initally some blogs saved", () => {
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
});

describe("addition of new note", () => {
  test("succeeds with valid data", async () => {
    await api
      .post("/api/blogs")
      .send({
        title: "Test Blog",
        author: "Test Author",
        likes: 14,
        url: "https://testurl.com",
      })
      .expect(201);
    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);
  });

  test("if blog's likes property is missing, default to 0", async () => {
    await api
      .post("/api/blogs")
      .send({
        title: "Test Blog",
        author: "Test Author",
        url: "https://testurl.com",
      })
      .expect(201);
    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  test("if blog's title property is missing, status 400 is sent back", async () => {
    await api
      .post("/api/blogs")
      .send({
        author: "Test Author",
        url: "https://testurl.com",
      })
      .expect(400);
    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length);
  });

  test("if blog's url property is missing, status 400 is sent back", async () => {
    await api
      .post("/api/blogs")
      .send({
        title: "Test Title",
        author: "Test Author",
      })
      .expect(400);
    const blogsAtEnd = await helper.blogsInDB();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.blogs);
});
