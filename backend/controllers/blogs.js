const blogRouter = require("express").Router();
const { update } = require("lodash");
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const Logger = require("../utils/logger");

//
//
// * GET All posts
//
//
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

//
//
// * GET Single Post
//
//
blogRouter.get("/:id", async (request, response) => {
  const post = await Blog.findById(request.params.id);

  response.json(post);
});

//
//
// * POST a new post
//
//
blogRouter.post("/", async (request, response) => {
  const body = request.body;
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: "token missing" });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id || request.token === undefined) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  const addedBlog = await blog.save();
  user.blogs = user.blogs.concat(addedBlog._id);
  await user.save();

  response.status(201).json(addedBlog);
});

//
//
// * DELETE post by ID
//
//
blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

//
//
// * PUT update to a post
//
//
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
