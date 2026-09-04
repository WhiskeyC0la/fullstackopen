import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useUsers } from '../hooks/useUsers'

const Users = () => {
  const { users, isPending, isError } = useUsers()

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
            <TableCell>{user.name}</TableCell>
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