import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useUsers } from '../hooks/useUsers'
import { Link } from 'react-router-dom'

const Users = () => {
  const { users, isPending, isError } = useUsers()

  // const match = useMatch('/users/:id')
  // const user = match
  //   ? users.find(user => user.id === match.params.id)
  //   : null

  if(isError) {
    return <h2>User service is not available due to problems on the server</h2>
  }

  if(isPending) {
    return <h2>Loading...</h2>
  }

  return (
  <div>
    <h2>Users</h2>
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
              <Link to={`/users/${user.id}`}>
                {user.name}
              </Link>
            </TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.blogs.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  )
}

export default Users