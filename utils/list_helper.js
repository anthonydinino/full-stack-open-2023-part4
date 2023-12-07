const dummy = (blogs) => {
  if (blogs) return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length == 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;
  return blogs.reduce((a, blog) => {
    return blog.likes + a;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length == 0) return {};
  const favorite = blogs.sort((a, b) => b.likes - a.likes);
  delete favorite[0]._id;
  delete favorite[0].url;
  delete favorite[0].__v;
  return favorite[0];
};

const mostBlogs = (blogs) => {
  if (blogs.length == 0) return {};
  const author = favoriteBlog(blogs).author;
  const count = blogs.reduce((a, blog) => {
    return author === blog.author ? ++a : a;
  }, 0);
  return {
    author,
    blogs: count,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length == 0) return {};
  const tally = {};
  blogs.forEach((blog) => {
    if (tally[blog.author]) tally[blog.author] += blog.likes;
    else tally[blog.author] = blog.likes;
  });
  const likes = Math.max.apply(null, Object.values(tally));
  for (const key in tally) {
    if (tally[key] === likes) return { author: key, likes };
  }
  return {};
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
