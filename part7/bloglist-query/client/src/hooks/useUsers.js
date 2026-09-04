import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

export const useUsers = () => {
    const { getAll } = userService

  const result = useQuery({
    queryKey: ['users'],
    queryFn: getAll,
    refetchOnWindowFocus: false,
    retry: false
  })

  return {
    users: result.data
    ? result.data.toSorted((a, b) => b.blogs.length - a.blogs.length)
    : [],
    isPending: result.isPending,
    isError: result.isError
  }
}