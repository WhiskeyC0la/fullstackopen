import { useAnecdoteActions } from '../store'
import { useNotificationControl } from '../notificationStore'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setNotification } = useNotificationControl()

  const addAnecdote = async event => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    if(!content) return
    await add(content)
    setNotification(`The anecdote '${content}' was successfully added`)
    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm