import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { Notification } from './components/Notification'
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
import { useNotificationControl } from './NotificationStore'
import { useBlogs, useBlogsControl } from './BlogsStore'
import { useUser, useUserControl } from './UserStore'

const App = () => {
  const [authChecked, setAuthChecked] = useState(false)
  const [blogsDownloadingChecked, setBlogsDownloadingChecked] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { setNotificationType, setNotification } = useNotificationControl()
  const blogs = useBlogs()
  const { add, vote, remove, initialize } = useBlogsControl()
  const user = useUser()
  const { login, logout, initializeUser } = useUserControl()

  useEffect(() => {
    initialize().then(() => {
      setBlogsDownloadingChecked(true)
    })
  }, [initialize])

  useEffect(() => {
    initializeUser()
    setAuthChecked(true)
  }, [initializeUser])

  const handleLogin = async credentials => {
    try {  
      const loggedUser = await login(credentials)
      navigate('/')
      setNotificationType('success')
      setNotification(`${loggedUser.name} successfully logged in`)
    } catch (error) {
      setNotificationType('error')
      setNotification(error.response?.data?.error)
    }
  }

  const handleLogout = () => {
    const name = user.name
    logout()
    navigate('/')
    setNotificationType('success')
    setNotification(`${name} successfully logged out`)
  }

  const addBlog = async newBlog => {
    try {
      const result = blogs.find(blog => blog.title === newBlog.title && blog.author === newBlog.author)
      if(!result) {
        await add(newBlog)
        navigate('/')
        setNotificationType('success')
        setNotification(`a new blog "${newBlog.title}" by ${newBlog.author} added`)
      } else {
        setNotificationType('error')
        setNotification(`a blog "${newBlog.title}" by ${newBlog.author} already exists`)
      }
    } catch (error) {
      setNotificationType('error')
      setNotification(error.response?.data?.error || 'something went wrong')
    }
  }

  const updateLikes = async (id) => {
    try {
      const result = blogs.find(blog => blog.id === id)
      await vote(id)
      setNotificationType('success')
      setNotification(`likes for "${result.title}" by ${result.author} were successfully updated`)
    } catch (error) {
      setNotificationType('error')
      setNotification(error.response?.data?.error || 'something went wrong')
    }
  }

  const deleteBlog = async (id) => {
    try{
      const blogToDelete = blogs.find(blog => blog.id === id)

      if(window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) {
        await remove(id)
        navigate('/')
        setNotificationType('success')
        setNotification(`Blog "${blogToDelete.title}" by ${blogToDelete.author} was successfully removed`)
      }
    } catch (error) {
      setNotificationType('error')
      setNotification(error.response?.data?.error || 'something went wrong')
    }
  }

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
              <Notification />
              <ul>
                {blogs.map(blog => (
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
                  <Notification />
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
                  <Notification />
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
                  <Notification />
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