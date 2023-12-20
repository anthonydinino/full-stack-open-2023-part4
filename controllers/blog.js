const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.status(200).json(blogs);
  });
});

blogRouter.post("/", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        res.status(400).json({ error: err.message });
      }
    });
});

blogRouter.delete("/:id", (req, res) => {
  res.send("deleting blog");
});

module.exports = blogRouter;
