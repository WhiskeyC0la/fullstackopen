import { create } from 'zustand'
import blogService from './services/blogs'

const useBlogsStore = create((set, get) => ({
  blogs: [],
  actions: {
    add: async content => {           
      const newBlog = await blogService.create(content)
      set(state => ({ blogs: state.blogs.concat(newBlog) }))
    },
    vote: async id => {
      const blog = get().blogs.find(blog => blog.id === id)
      const updatedBlog = await blogService.update(
        id, { ...blog, likes: blog.likes + 1 })
      set(state => ({
        blogs: state.blogs.map(blog => blog.id === id
          ? updatedBlog
          : blog
        )
      }))
    },
    remove: async id => {
      await blogService.remove(id)
      set(state =>({
        blogs: state.blogs.filter(blog => blog.id !== id)
      }))
    },
    initialize: async() => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    }
  }
}))

export const useBlogs = () => useBlogsStore(state => state.blogs).toSorted((a, b) => b.likes - a.likes)
export const useBlogsControl = () => useBlogsStore(state => state.actions)