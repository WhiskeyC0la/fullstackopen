import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'

const useUserStore = create((set) => ({
  user: null,
  actions: {
    login: async(credentials) => {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      set(() => ({ user }))
      return user
    },
    logout: () => {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      set(() => ({ user: null }))
    },
    initializeUser: () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if(loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        set(() => ({ user }))
        blogService.setToken(user.token)
      }
    }
  }
}))

export const useUser = () => useUserStore(state => state.user)
export const useUserControl = () => useUserStore(state => state.actions)