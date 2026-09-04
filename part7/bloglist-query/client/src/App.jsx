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
  useLocation
} from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { useNotification } from './hooks/useNotification'
import { useUser } from './hooks/useUser'
import Users from './components/Users'
import Blogs from './components/Blogs'
import User from './components/User'

const App = () => {
  const [authChecked, setAuthChecked] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { showNotification } = useNotification()
  const { user, login, logout, initializeUser } = useUser()

  useEffect(() => {
    initializeUser()
    setAuthChecked(true)
  }, [initializeUser])

  const handleLogin = async credentials => {
    try {  
      const loggedUser = await login(credentials)
      navigate('/')
      showNotification('success', `${loggedUser.name} successfully logged in`)
    } catch (error) {
      showNotification('error', error.response?.data?.error)
    }
  }

  const handleLogout = () => {
    const name = user.name
    logout()
    navigate('/')
    showNotification('success', `${name} successfully logged out`)
  }

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
            <Button
              color='inherit'
              component={Link}
              to='/users'
              sx={{ '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' } }}
            >users</Button>
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
            <Blogs />
          }
          />
          <Route path='/users' element={
            <Users />
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
          <Route path='/users/:id' element={
            <User />
          }
          />
          <Route path='/blogs/:id' element={
            <Blog user={user} />
          }
          />
          <Route path='/create' element={
            user !== null
              ? (
                <div>
                  <h2>create new</h2>
                  <Notification />
                  <BlogForm />
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