const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: true,
    name: true,
  });
  res.status(200).json(blogs);
});

blogRouter.post("/", async (req, res) => {
  const blog = new Blog({ title, author, url, user: req.user.id });
  req.user.blogs = [...req.user.blogs, blog._id];
  const newBlog = await blog.save();
  await req.user.save();
  res.status(201).json(newBlog);
});

blogRouter.delete("/:id", async (req, res) => {
  const blogId = req.user.blogs
    .map((id) => id.toString())
    .filter((id) => id === req.params.id)[0];

  const result = await Blog.deleteOne({
    _id: blogId,
  });

  res.sendStatus(result.deletedCount ? 204 : 404);
});

blogRouter.delete("/", async (req, res) => {
  await Blog.deleteMany({});
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
