import { Typography, Box, Button, Link } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {

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
            onClick={() => updateLikes(blog.id)}
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