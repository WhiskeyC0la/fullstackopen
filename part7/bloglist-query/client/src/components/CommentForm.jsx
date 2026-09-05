import { useBlogs } from '../hooks/useBlogs' 
import { useField } from '../hooks/useField'
import { Box, TextField, Button } from '@mui/material'
const CommentForm = ({ id }) => {
  const { createComment } = useBlogs()
  const { reset, ...comment } = useField('add a comment', 'text')
  
  const handleSubmit = event => {
    event.preventDefault()

    const newComment = {
      comment: comment.value.trim()
    }
    
    createComment({id, comment: newComment}, {
      onSuccess: () => {
        reset()
      }
    })
    
  }
  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1
      }}
    >
      <TextField
        size='small'
        variant='outlined'
        { ...comment}
      />
      <Button 
        type='submit' 
        variant='contained'
        >ADD COMMENT</Button>
    </Box>
  )
}

export default CommentForm