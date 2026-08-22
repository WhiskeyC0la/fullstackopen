import { useAnecdoteActions, useAnecdotes } from '../store'
import { useNotificationControl } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { setNotification } = useNotificationControl()

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={async () => {
                  await vote(anecdote.id)
                  setNotification(`You voted '${anecdote.content}'`)
                }
                }>vote
              </button>
              {anecdote.votes === 0 && (
              <button onClick={async () => {
                await remove(anecdote.id)
                setNotification(`Anecdote '${anecdote.content}' was successfully removed`)
              }}>delete
              </button>
              )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList