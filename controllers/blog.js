const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/test", (req, res) => {
  res.send("hello");
});

blogRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.status(200).json(blogs);
  });
});

blogRouter.post("/", (req, res) => {
  const blog = new Blog(req.body);

  blog.save().then((result) => {
    res.status(201).json(result);
  });
});

module.exports = blogRouter;
