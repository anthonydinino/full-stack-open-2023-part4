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

blogRouter.put("/:id", async (req, res) => {
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };
  const newBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.status(200).json(newBlog);
});

module.exports = blogRouter;
