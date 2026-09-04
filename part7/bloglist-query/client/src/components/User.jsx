import { useMatch } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { Box } from '@mui/material'

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
    return <h2>Loading...</h2>
  }

  return (
    user
    ? <Box sx={userStyle}>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map(blog => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </Box>
      : <h2>404 Page not found</h2>
  )
}

export default User