import { useAnecdotes } from '../hooks/useAnecdotes'
import  useNotification  from '../hooks/useNotification'

const AnecdoteForm = () => {
  const { create } = useAnecdotes()
  const { showNotification } = useNotification()
  
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    create(content)
    showNotification(`The anecdote '${content}' was successfully added`)
    event.target.reset()
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm