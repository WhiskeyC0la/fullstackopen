import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const blogFormRef = useRef()

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
    const name = user.name
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessageType('success')
    setMessage(`${name} successfully logged out`)
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
        blogFormRef.current.hide()
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

  const updateLikes = async (id) => {
    try {
      const result = blogs.find(blog => blog.id === id)

      const blogToUpdate = {
        title: result.title,
        author: result.author,
        url: result.url,
        likes: result.likes + 1,
        user: result.user
      }
      
      await blogService.update(id, blogToUpdate)
      const blogsAfterUpdate = await blogService.getAll()
      setBlogs(blogsAfterUpdate)
      setMessageType('success')
      setMessage(`likes for ${result.title} by ${result.author} were successfully updated`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessageType('error')
      setMessage(error.response?.data?.error || 'something went wrong')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    try{
      const blogToDelete = blogs.find(blog => blog.id === id)
      
      if(window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setMessageType('success') 
        setMessage(`Blog ${blogToDelete.title} by ${blogToDelete.author} was successfully removed`)
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

  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)

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
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog}/>)}
    </div>
  )
}

export default App