const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const logger = require("../utils/logger");

test("1 - Find Exact Blog", async () => {
  const myBlog = {
    author: "Tupac Nokur",
    title: "Gangstas R 4 Eva",
    id: "6421b3190068e96adcf3475e",
    url: "https://www.tupacsthots.com",
    likes: 1170,
  };

  const res = await api.get("/api/blogs");
  expect(res.body).toContainEqual(myBlog);
});

test("2 - Verify UUID is id", async () => {
  const res = await api.get("/api/blogs");
  expect(res.body[0].id).toBeDefined();
});

test("3 - Successful Post", async () => {
  const initialGet = await api.get("/api/blogs");

  const random = Math.floor(Math.random() * 100);

  const newPost = {
    author: "Sample Author",
    title: `Sample Title #${random}`,
    url: "Sample Url",
    likes: 1111,
  };

  await api.post("/api/blogs").send(newPost).expect(201);

  const finalGet = await api.get("/api/blogs");

  expect(finalGet.body).toHaveLength(initialGet.body.length + 1);
});

// TODO 4.11
//Write a test that verifies that if the likes property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet. Make the required changes to the code so that it passes the test.

// TODO 4.12
// Write tests related to creating new blogs via the /api/blogs endpoint, that verify that if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request. Make the required changes to the code so that it passes the test.

test("6 - Delete Post", async () => {
  const id = `6421cba3ec83c9065f34c956`;

  const initialGet = await api.get(`/api/blogs/${id}`).expect(200);

  await api.delete(`/api/blogs/${id}`).expect(204);

  const finalGet = await api.get(`/api/blogs/${id}`);
  expect(finalGet.body).toBeNull();
});

test("7 - Update Post", async () => {
  const random = Math.floor(Math.random() * 10000);
  const id = `64133d11b70b21c10dac3fd8`;
  const previousPost = await api.get(`/api/blogs/${id}`).expect(200);

  const updatedPost = {
    ...previousPost.body,
    likes: random,
  };

  const response = await api
    .put(`/api/blogs/${id}`)
    .send(updatedPost)
    .set("Content-Type", "application/json")
    .expect(200);
});

afterAll(async () => {
  await mongoose.connection.close();
});
