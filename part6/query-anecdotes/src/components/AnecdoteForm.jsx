import { useAnecdotes } from "../hooks/useAnecdotes"

const AnecdoteForm = () => {
  const { create } = useAnecdotes()
  
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    create(content)
    event.target.reset()
    console.log('created')
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