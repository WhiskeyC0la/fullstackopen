import { useBlogs } from '../hooks/useBlogs'
import { Notification } from './Notification'
import { Link as RouterLink} from 'react-router-dom'
import { Box, Typography, Link } from '@mui/material'

const Blogs = () => {
  const { blogs, isPending, isError } = useBlogs()

  if(isError) {
    return (
      <Typography sx={{ mt: 3 }}>
        Blog service is not available due to problems on the server
      </Typography>
      )
  }

  if(isPending) {
    return (
      <Typography variant='h5' sx={{ mt: 3 }}>
        Loading...
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: 700
      }}
    >
      <Typography variant='h5'
      sx={{ mt: 3, mb: 2}}
      >Blogs
      </Typography>
      <Notification />
        {blogs.map(blog => (
          <Box
            key={blog.id}
            sx={{
              py: 0.8,
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Link
              component={RouterLink}
              to={`/blogs/${blog.id}`}
              underline='hover'
              variant='body1'
            >
              {blog.title}
            </Link>
            <Typography
              variant='body2'
              color='text.secondary'
            >
              by {blog.author}
            </Typography>
          </Box>
        ))}
    </Box>
  )
}

export default Blogs