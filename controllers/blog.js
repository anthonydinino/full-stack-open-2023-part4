const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.status(200).json(blogs);
});

blogRouter.post("/", async (req, res) => {
  const blog = new Blog(req.body);
  const newBlog = await blog.save();
  res.status(201).json(newBlog);
});

blogRouter.delete("/:id", async (req, res) => {
  await Blog.deleteOne({ _id: req.params.id });
  res.sendStatus(204);
});

module.exports = blogRouter;
