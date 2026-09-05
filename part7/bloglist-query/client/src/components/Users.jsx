import { Box, Link, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useUsers } from '../hooks/useUsers'
import { Link as RouterLink } from 'react-router-dom'

const Users = () => {
  const { users, isPending, isError } = useUsers()

  if(isError) {
    return (
      <Typography sx={{ mt: 3 }}>
        User service is not available due to problems on the server
      </Typography>
    )
  }

  if(isPending) {
    return (
      <Typography variant='h5' sx={{ mt: 3 }}>
        Loading...
      </Typography>
    )
  }

  return (
  <Box>
    <Typography variant='h5' sx={{ mt: 3, mb: 2 }}>
      Users
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Blogs created</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>
              <Link
                component={RouterLink}
                to={`/users/${user.id}`}
                underline='hover'
              >
                {user.name}
              </Link>
            </TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.blogs.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
  )
}

export default Users