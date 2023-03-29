import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  //
  // * Get Blogs useEffect
  //
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  //
  // * Set Token useEffect
  //
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials, try again");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogOut = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();
    console.log(event);

    const newObject = {
      title: event.target[0].value,
      author: event.target[1].value,
      url: event.target[2].value,
    };

    console.log(newObject);

    try {
      const sendNewBlog = await blogService.create(newObject);
      console.log(sendNewBlog);

      setBlogs(blogs.concat(sendNewBlog));
    } catch {
      <h1>Error Sending the Message</h1>;
    }
  };

  const blogsList = () => {
    return (
      <>
        <p>{user.username} is logged in. Want to signout?</p>
        <button onClick={handleLogOut}>Log Out</button>
        <br />
        <br />
        <div>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      </>
    );
  };

  const loginForm = () => {
    return (
      <>
        <form onSubmit={handleLogin}>
          <div>
            Username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <input type="submit" value="Sign in" />
        </form>
      </>
    );
  };

  const newBlogForm = () => {
    let title;
    let author;
    let url;

    return (
      <>
        <form onSubmit={handleNewBlog}>
          <div>
            <label htmlFor="title">Title:</label>
            <input type="text" name="title" value={title} />
          </div>
          <div>
            <label htmlFor="author">Author:</label>
            <input type="text" name="author" value={author} />
          </div>
          <div>
            <label htmlFor="url">Url:</label>
            <input type="text" name="url" value={url} />
          </div>
          <input type="submit" value="Create New Blog" />
        </form>
      </>
    );
  };

  return (
    <div>
      <h2>The Official Blog App</h2>
      {user === null && loginForm()}
      {user !== null && blogsList()}
      <br />
      <br />
      {user !== null && newBlogForm()}
    </div>
  );
};

export default App;
