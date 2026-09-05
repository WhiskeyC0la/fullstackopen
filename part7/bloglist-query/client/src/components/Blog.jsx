import { Typography, Box, Button, Link } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { useBlogs } from '../hooks/useBlogs'
import { useMatch, useNavigate } from 'react-router-dom'
import { Notification } from './Notification'
import CommentForm from './CommentForm'
const Blog = ({ user }) => {
  const { blogs, isPending, isError, vote, remove } = useBlogs()
  const navigate = useNavigate()

  const blogStyle = {
    pt: 3,
    pl: 2,
    border: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'divider',
    mt: 2,
    mb: 2,
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null
  
  const deleteBlog = () => {
    
    if (
      window.confirm(
        `Remove blog ${blog.title} by ${blog.author}?`,
      )
    ) {
      remove(blog, {
        onSuccess: () => navigate('/'),
      })
    }
  }

  if (isError) {
    return (
      <div>Blog service is not available due to problems on the server</div>
    )
  }

  if (isPending) {
    return <h2>Loading...</h2>
  }
  
  return blog ? (
    <div>
      <Notification />
      <Box sx={blogStyle}>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography variant="h6">by {blog.author}</Typography>
        <Typography variant="body2" sx={{ my: 1 }}>
          <Link href={blog.url}>{blog.url}</Link>
        </Typography>
        <Typography variant="body2">Added by {blog.user.name}</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            mt: 2,
            mb: 3,
          }}
        >
          <Typography variant="body2">{blog.likes} likes</Typography>
          {user && (
            <Button
              onClick={() => vote(blog)}
              variant="outlined"
              size="small"
              color="info"
              startIcon={<ThumbUpIcon />}
            >
              like
            </Button>
          )}
          {user && blog.user.username === user.username && (
            <Button
              onClick={deleteBlog}
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
            >
              remove
            </Button>
          )}
        </Box>
        <Box>
          <Typography variant='body1'>Comments:</Typography>
          <CommentForm id={blog.id}/>
          {blog.comments.length > 0 && (
            <ul>
              {blog.comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
          )}
        </Box>
      </Box>
    </div>
  ) : (
    <h2>404 Page not found</h2>
  )
}

export default Blog