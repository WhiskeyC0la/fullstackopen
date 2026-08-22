import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import logger from './services/logger'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create(devtools(logger((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async id => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes +1 }
      )
      set(state => ({
      anecdotes: state.anecdotes.map(anecdote =>
        anecdote.id === id ? updatedAnecdote : anecdote
      )
    }))},
    add: async content => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote)}))
    },
    remove: async id => {
      await anecdoteService.remove(id)
      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: value => set({
      filter: value
    }),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    }
  }
}))))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes).toSorted((a, b) => b.votes - a.votes)
  const filter = useAnecdoteStore(state => state.filter)
  return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter))
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export default useAnecdoteStore