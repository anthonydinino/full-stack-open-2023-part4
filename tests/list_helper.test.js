const listHelper = require("./list_helper");
const blogHelper = require("./blog_helper");
const listWithOneBlog = blogHelper.listWithOneBlog;
const blogs = blogHelper.blogs;

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(47);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog equals to that", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("most blogs", () => {
  test("when list has only one blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", blogs: 1 });
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", blogs: 2 });
  });
});

describe("most likes", () => {
  test("when list has only one blog", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 5 });
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: "Robert C. Martin", likes: 23 });
  });
});

module.exports = { blogs };
