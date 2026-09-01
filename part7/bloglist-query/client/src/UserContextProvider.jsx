import { useState, useCallback } from 'react'
import { UserContext } from './UserContext.js'
import loginService from './services/login'
import blogService from './services/blogs'
import persistentUser from './services/persistentUser.js'
export const UserContextProvider = ({children}) => {
  const [user, setUser] = useState(null)

  const login = async(credentials) => {
    const user = await loginService.login(credentials)
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    setUser(user)
    return user
  }

  const logout = () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    setUser(null)
  }

  const initializeUser = useCallback(() => {
    const user = persistentUser.getUser()
    if(user) {
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