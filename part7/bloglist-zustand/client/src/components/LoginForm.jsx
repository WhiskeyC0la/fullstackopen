import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'


const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    await handleLogin({
      username,
      password
    })
    setUsername('')
    setPassword('')
  }

  const handleUsername = event => {
    setUsername(event.target.value)
  }

  const handlePassword = event => {
    setPassword(event.target.value)
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2
      }}
    >
      <TextField
        variant='filled'
        size='small'
        label='username'
        type='text'
        value={username}
        onChange={handleUsername}
      />
      <TextField
        variant='filled'
        size='small'
        label='password'
        type='password'
        value={password}
        onChange={handlePassword}
      />
      <Button type='submit' variant='contained' >login</Button>
    </Box>
  )
}

export default LoginForm