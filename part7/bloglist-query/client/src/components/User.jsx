import { useMatch } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { Box, Typography } from '@mui/material'

const User = () => {
  const { users, isPending } = useUsers()    
  const userStyle = {
    pt: 3,
    pl: 2,
    border: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'divider',
    mt: 2,
    mb: 2
  }

  const match = useMatch('/users/:id')
  const user = match
    ? users.find(user => user.id === match.params.id)
    : null

  if(isPending) {
    return (
      <Typography variant='h5' sx={{ mt: 3 }}>
        Loading...
      </Typography>
    )
  }

  return (
    user
    ? <Box sx={userStyle}>
        <Typography variant='h5' sx={{ mb: 2 }}>
          {user.name}
        </Typography>
        <Typography
          variant='h6'
          sx={{ 
            mb: 1,
            borderBottom: 1,
            borderColor: 'divider',
            maxWidth: { sm: 400, md: 700 }
          }}>
          added blogs:
        </Typography>
        <Box>
          {user.blogs.map(blog => (
            <Box 
              key={blog.id}
              sx={{
                py: 0.8,
                maxWidth: { sm: 400, md: 700 }
              }}
            >
              <Typography variant='body1'>
                {blog.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      : <Typography variant='h5'>
          404 Page not found
        </Typography>
  )
}

export default User