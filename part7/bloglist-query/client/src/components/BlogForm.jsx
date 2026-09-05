import { TextField, Button, Box } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import { useNotification } from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/useField'

const BlogForm = () => {
  const { reset: titleReset, ...title } = useField('title', 'text')
  const { reset: authorReset, ...author } = useField('author', 'text')
  const { reset: urlReset, ...url } = useField('url', 'url')
  const { blogs, create } = useBlogs()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = event => {
    event.preventDefault()

    const newBlog = {
      title: title.value.trim(),
      author: author.value.trim(),
      url: url.value.trim()
    }
    const result = blogs.find(blog => blog.title === newBlog.title && blog.author === newBlog.author)
    if(!result) {
      create(newBlog, {
        onSuccess: () => {
          titleReset()
          authorReset()
          urlReset()
          navigate('/')
        }
      })
    } else showNotification('error', `a blog "${newBlog.title}" by ${newBlog.author} already exists`)
  }
  
  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        width: '100%',
        maxWidth: { sm: 300, md:500 }
      }}
    >
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        { ...title}
      />
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        { ...author}
      />
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        { ...url}
      />
      <Button type='submit' variant='contained' >create</Button>
    </Box>
  )
}

export default BlogForm