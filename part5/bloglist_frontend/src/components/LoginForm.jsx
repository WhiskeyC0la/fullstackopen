import { useState } from 'react'


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
    <form onSubmit={handleSubmit}>
      <div>
        <label>
        username
          <input
            type='text'
            value={username}
            onChange={handleUsername}
          />
        </label>
      </div>
      <div>
        <label>
        password
          <input
            type='password'
            value={password}
            onChange={handlePassword}
          />
        </label>
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm