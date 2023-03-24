const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

test("Get all blogs from database", () => {
  const myBlog = {
    title: "Gangstas R 4 Eva",
    author: "Tupac Nokur",
    url: "https://www.tupacsthots.com",
    likes: 1170,
  };
  api.get("/api/blogs").expect(response.body).toContain(myBlog);
});

afterAll(async () => {
  await mongoose.connection.close();
});
