import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch,
  useLocation
} from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [blogsDownloadingChecked, setBlogsDownloadingChecked] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
      setBlogsDownloadingChecked(true)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    setAuthChecked(true)
  }, [])

  const handleLogin = async credentials => {

    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
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
    navigate('/')
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
        const blogWithUser = {
          ...createdBlog,
          user: user
        }
        setBlogs(blogs.concat(blogWithUser))
        navigate('/')
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
      setMessage(`likes for "${result.title}" by ${result.author} were successfully updated`)
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
        navigate('/')
        setMessageType('success')
        setMessage(`Blog "${blogToDelete.title}" by ${blogToDelete.author} was successfully removed`)
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

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  if(!authChecked) {
    return null
  }

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant='h5'>
          Blog App
          </Typography>
          {user && (
            <Typography variant='body1'>
              {user.name} logged in
            </Typography>
          )}
          <Box>
            <Button
              color='inherit'
              component={Link}
              to='/'
              sx={{ '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' } }}
            >blogs</Button>
            {user !== null
              ? <Button
                color='inherit'
                component={Link}
                to='/create'
                sx={{ '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' } }}
              >new blog</Button>
              : null}
            {user === null
              ?  <Button
                color='inherit'
                component={Link}
                to='/login'
                sx={{ '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' } }}
              >login</Button>
              : <Button
                color='inherit'
                onClick={handleLogout}
                sx={{ '&:hover': { bgcolor: 'rgba(191, 94, 94, 0.75)' } }}
              >logout</Button>
            }
          </Box>
        </Toolbar>
      </AppBar>

      <ErrorBoundary key={location.pathname}>
        <Routes>
          <Route path='/' element={
            <div>
              <h2>blogs</h2>
              <Notification message={message} type={messageType}/>
              <ul>
                {sortedBlogs.map(blog => (
                  <li key={blog.id} >
                    <Link to={`/blogs/${blog.id}`}>
                      {`${blog.title} by ${blog.author}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          }
          />
          <Route path='/login' element={
            user === null
              ? (
                <div>
                  <h2>Log in to application</h2>
                  <Notification message={message} type={messageType} />
                  <LoginForm handleLogin={handleLogin}/>
                </div>
              )
              : <Navigate to='/' replace/>
          }
          />
          <Route path='/blogs/:id' element={
            !blogsDownloadingChecked
              ? <h2>Loading...</h2>
              : blog
                ? <div>
                  <Notification message={message} type={messageType} />
                  <Blog blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} user={user} />
                </div>
                : <h2>404 - Page not found</h2>
          }
          />
          <Route path='/create' element={
            user !== null
              ? (
                <div>
                  <h2>create new</h2>
                  <Notification message={message} type={messageType} />
                  <BlogForm addBlog={addBlog} />
                </div>
              )
              : <Navigate to='/login' replace />
          }
          />
          <Route path='*' element={
            <div>
              <h2>404 - Page not found</h2>
            </div>
          }/>
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App