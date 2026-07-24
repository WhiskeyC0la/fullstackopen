import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'

const BlogForm = ({ addBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const handleBlogTitle = event => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthor = event => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrl = event => {
    setNewBlogUrl(event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    await addBlog({
      title: newBlogTitle.trim(),
      author: newBlogAuthor.trim(),
      url: newBlogUrl.trim()
    })
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
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