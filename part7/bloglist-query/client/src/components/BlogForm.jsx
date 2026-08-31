import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import { useNotification } from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'

const BlogForm = () => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const { blogs, create } = useBlogs()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const handleBlogTitle = event => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthor = event => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrl = event => {
    setNewBlogUrl(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    const newBlog = {
      title: newBlogTitle.trim(),
      author: newBlogAuthor.trim(),
      url: newBlogUrl.trim()
    }
    const result = blogs.find(blog => blog.title === newBlog.title && blog.author === newBlog.author)
    if(!result) {
      create(newBlog, {
        onSuccess: () => {
          setNewBlogTitle('')
          setNewBlogAuthor('')
          setNewBlogUrl('')
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
        width: '50%'
      }}
    >
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        label='title'
        type='text'
        value={newBlogTitle}
        onChange={handleBlogTitle}
      />
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        label='author'
        type='text'
        value={newBlogAuthor}
        onChange={handleBlogAuthor}
      />
      <TextField
        fullWidth
        size='small'
        variant='outlined'
        label='url'
        type='url'
        value={newBlogUrl}
        onChange={handleBlogUrl}
      />
      <Button type='submit' variant='contained' >create</Button>
    </Box>
  )
}

export default BlogForm