const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: true,
    name: true,
  });
  res.status(200).json(blogs);
});

blogRouter.post("/", async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken) {
    res.status(401);
    throw new Error("token invalid");
  }
  const { title, author, url } = req.body;

  const user = await User.findById(decodedToken.id);
  const blog = new Blog({ title, author, url, user: user.id });
  user.blogs = [...user.blogs, blog._id];
  const newBlog = await blog.save();
  await user.save();
  res.status(201).json(newBlog);
});

blogRouter.delete("/:id", async (req, res) => {
  await Blog.deleteOne({ _id: req.params.id });
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
