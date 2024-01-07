const blogRouter = require("express").Router();
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../middleware");
require("express-async-errors");

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
  const newBlog = {
    user: req.body.user,
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes,
  };

  // validation
  Object.keys(newBlog).forEach((k) => {
    if (!newBlog[k]) throw new Error(`missing ${k}`);
  });
  const user = await User.findById(newBlog.user);
  if (!user) throw new Error(`cannot find user`);

  let blog = await Blog.findById(req.params.id);

  // if blog is switching user
  if (user.id !== blog.user.toString()) {
    // add blog to new user
    user.blogs.push(new mongoose.Types.ObjectId(blog.id));
    user.save();

    // remove blog from existing user
    const oldUser = await User.findById(blog.user.toString());
    oldUser.blogs = oldUser.blogs.filter((b) => {
      b.id !== blog.id;
    });
    oldUser.save();
  }

  blog.overwrite(newBlog);
  await blog.save();
  res.status(200).json(blog);
});

module.exports = blogRouter;
