import { useAnecdoteActions, useAnecdotes } from '../store'
import { useNotificationControl } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()
  const { setNotification } = useNotificationControl()
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => {
                  vote(anecdote.id)
                  setNotification(`You voted '${anecdote.content}'`)
                }
                }>vote
              </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList