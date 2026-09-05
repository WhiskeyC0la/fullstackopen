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
          <Typography variant='h5'
            sx={{
              fontSize: {
                sm: '1rem',
                md: '1.5rem'
              }
            }}
          >Blog App
          </Typography>
          {user && (
            <Typography variant='body1'
              sx={{
                fontSize: {
                  sm: '0.8rem',
                  md: '1rem'
                }
              }}
            >{user.name} logged in
            </Typography>
          )}
          <Box>
            <Button
              color='inherit'
              component={Link}
              to='/'
              sx={{
                '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' },
                fontSize: { sm: '0.7rem', md: '0.875rem' },
                px: { sm: 0.5, md: 2 }
              }}
            >blogs</Button>
            <Button
              color='inherit'
              component={Link}
              to='/users'
              sx={{
                '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' },
                fontSize: { sm: '0.7rem', md: '0.875rem' },
                px: { sm: 0.5, md: 2 }
              }}
            >users</Button>
            {user !== null
              ? <Button
                color='inherit'
                component={Link}
                to='/create'
                sx={{
                  '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' },
                  fontSize: { sm: '0.7rem', md: '0.875rem' },
                  px: { sm: 0.5, md: 2 }
                }}
              >new blog</Button>
              : null}
            {user === null
              ?  <Button
                color='inherit'
                component={Link}
                to='/login'
                sx={{
                  '&:hover': { bgcolor: 'rgba(94, 191, 191, 0.75)' },
                  fontSize: { sm: '0.7rem', md: '0.875rem' },
                  px: { sm: 0.5, md: 2 }
                }}
              >login</Button>
              : <Button
                color='inherit'
                onClick={handleLogout}
                sx={{
                  '&:hover': { bgcolor: 'rgba(191, 94, 94, 0.75)' },
                  fontSize: { sm: '0.7rem', md: '0.875rem' },
                  px: { sm: 0.5, md: 2 }
                }}
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
                  <Typography variant='h5' sx={{ mt: 3, mb: 2 }}>
                    Log in to application
                  </Typography>
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
                  <Typography variant='h5' sx={{ mt: 3, mb: 2 }}>
                    Create new blog
                  </Typography>
                  <Notification />
                  <BlogForm />
                </div>
              )
              : <Navigate to='/login' replace />
          }
          />
          <Route path='*' element={  
            <Typography variant='h5' sx={{ mt: 3 }}>
              404 - Page not found
            </Typography>
          }/>
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App