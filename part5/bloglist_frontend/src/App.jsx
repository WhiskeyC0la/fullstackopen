import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async credentials => {
  
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (error) {
      setMessageType('error')
      setMessage(error.response?.data?.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessageType('success')
    setMessage(`${user.name} successfully logged out`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = async newBlog => {
    try {
      const result = blogs.find(blog => blog.title === newBlog.title && blog.author === newBlog.author)
      if(!result) {
        const createdBlog = await blogService.create(newBlog)
        setBlogs(blogs.concat(createdBlog))
        setMessageType('success')
        setMessage(`a new blog "${createdBlog.title}" by ${createdBlog.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } else {
        setMessageType('error')
        setMessage(`a blog "${newBlog.title}" by ${newBlog.author} already exists`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    } catch (error) {
      setMessageType('error')
      setMessage(error.response?.data?.error || 'something went wrong')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if(!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} type={messageType} />
        <LoginForm handleLogin={handleLogin}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={messageType} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>
      <BlogForm addBlog={addBlog} />
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App