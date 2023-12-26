const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../middleware");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: true,
    name: true,
  });
  res.status(200).json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (req, res) => {
  const { title, author, url } = req.body;
  const blog = new Blog({ title, author, url, user: req.user.id });
  const newBlog = await blog.save();
  req.user.blogs = [...req.user.blogs, blog];
  await req.user.save();
  res.status(201).json(newBlog);
});

blogRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  if (!req.user.blogs.map((id) => id.toString()).includes(req.params.id)) {
    return res.sendStatus(404);
  }
  await Blog.deleteOne({ _id: req.params.id });
  req.user.blogs = req.user.blogs.filter(
    (blogId) => blogId.toString() !== req.params.id
  );
  await req.user.save();
  res.sendStatus(204);
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
