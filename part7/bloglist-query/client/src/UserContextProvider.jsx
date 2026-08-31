import { useState, useCallback } from 'react'
import { UserContext } from './UserContext.js'
import loginService from './services/login'
import blogService from './services/blogs'

export const UserContextProvider = ({children}) => {
  const [user, setUser] = useState(null)

  const login = async(credentials) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    setUser(user)
    return user
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const initializeUser = useCallback(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  return (
    <UserContext.Provider value={{ user, login, logout, initializeUser }}>
      {children}
    </UserContext.Provider>
  )
}