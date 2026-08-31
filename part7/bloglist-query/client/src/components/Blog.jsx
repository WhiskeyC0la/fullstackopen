import { Typography, Box, Button, Link } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { useBlogs } from '../hooks/useBlogs'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, user }) => {
  const { blogs, vote, remove } = useBlogs()
  const navigate = useNavigate()

  const blogStyle = {
    pt: 3,
    pl: 2,
    border: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'divider',
    mt: 2,
    mb: 2
  }

  const deleteBlog = (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if(window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      remove(blogToDelete, {
        onSuccess: () => navigate('/') 
      })
    }
  }

  if(!blog) {
    return null
  }

  return (
    <Box sx={blogStyle}>
      <Typography variant='h5'>
        {blog.title}
      </Typography>
      <Typography variant='h6'>
        by {blog.author}
      </Typography>
      <Typography variant='body2' sx={{ my: 1 }}>
        <Link href={blog.url}>
          {blog.url}
        </Link>
      </Typography>
      <Typography variant='body2'>
          Added by {blog.user.name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          mt: 2,
          mb: 3
        }}
      >
        <Typography variant='body2'>
          {blog.likes} likes
        </Typography>
        {user && (
          <Button
            onClick={() => vote(blog)}
            variant='outlined'
            size='small'
            color='info'
            startIcon={<ThumbUpIcon />}
          >like</Button>
        )}
        {user && blog.user.username === user.username && (
          <Button
            onClick={() => deleteBlog(blog.id)}
            variant='outlined'
            size='small'
            color='error'
            startIcon={<DeleteIcon />}
          >remove</Button>
        )}
      </Box>
    </Box>
  )}

export default Blog