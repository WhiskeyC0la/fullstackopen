import { TextField, Button, Box } from '@mui/material'
import { useField } from '../hooks/useField'

const LoginForm = ({ handleLogin }) => {
  const { reset: usernameReset, ...username } = useField('username', 'text')
  const { reset: passwordReset, ...password } = useField('password', 'password')

  const handleSubmit = async event => {
    event.preventDefault()

    await handleLogin({
      username: username.value,
      password: password.value
    })
    usernameReset()
    passwordReset()
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
        { ...username}
      />
      <TextField
        variant='filled'
        size='small'
        { ...password}
      />
      <Button type='submit' variant='contained' >login</Button>
    </Box>
  )
}

export default LoginForm