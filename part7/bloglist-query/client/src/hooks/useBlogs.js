import { useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from './useNotification'

export const useBlogs = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useNotification()
  const { getAll, create, update, remove } = blogService

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    retry: false
  })

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      showNotification('success', `a new blog "${newBlog.title}" by ${newBlog.author} added`)
    },
    onError: (error) => {
      showNotification('error', error.response?.data?.error || error.message || 'something went wrong')
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], 
        blogs.map(blog => blog.id === updatedBlog.id
        ? updatedBlog
        : blog
      ))
      showNotification('success', `likes for "${updatedBlog.title}" by ${updatedBlog.author} were successfully updated`)
    },
    onError: (error) => {
      showNotification('error', error.response?.data?.error || error.message || 'something went wrong')
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogToDelete => remove(blogToDelete.id),
    onSuccess: (_, blogToDelete) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'],
        blogs.filter(blog => blog.id !== blogToDelete.id))
      showNotification('success', `Blog "${blogToDelete.title}" by ${blogToDelete.author} was successfully removed`)
    },
    onError: (error) => {
      showNotification('error', error.response?.data?.error || error.message || 'something went wrong')
    }
  })

  return {
    blogs: result.data
    ? result.data.toSorted((a,b) => b.likes - a.likes)
    : [],
    isPending: result.isPending,
    isError: result.isError,
    create: (newBlog, options) => newBlogMutation.mutate(newBlog, options),
    vote: (blogToUpdate) => updateBlogMutation.mutate({ ...blogToUpdate, likes: blogToUpdate.likes + 1}),
    remove: (blogToDelete, options) => deleteBlogMutation.mutate(blogToDelete, options)
  }
}