import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const { reset: contentReset, ...content } = useField('text')
  const { reset: authorReset, ...author } = useField('text')
  const { reset: infoReset, ...info } = useField('text')
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0 
    })
    navigate('/')
  }

  const handleReset = () => {
    contentReset()
    authorReset()
    infoReset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input { ...content } />
        </div>
        <div>
          author
          <input { ...author }/>
        </div>
        <div>
          url for more info
          <input { ...info }/>
        </div>
        <button type='submit'>create</button>
        <button type='button' onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew