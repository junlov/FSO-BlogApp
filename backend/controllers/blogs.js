const blogRouter = require("express").Router();
const { update } = require("lodash");
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const post = await Blog.findById(request.params.id);

  response.json(post);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const addedBlog = await blog.save();

  response.status(201).json(addedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
  const { likes, author, title, url } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes, author, url, title },
    {
      new: true,
    }
  );

  response.json(updatedBlog);
});

module.exports = blogRouter;
