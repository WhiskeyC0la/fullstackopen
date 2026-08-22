import { test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes.js', () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})


const mockAnecdotes = [
  { content: 'firstOne', votes: 0, id: 1 },
  { content: 'secondOne', votes: 0, id: 2 },
  { content: 'thirdOne', votes: 0, id: 3}
]

test('initialize loads anecdotes from service', async () => {
  anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

  const { result } = renderHook(() => useAnecdoteActions())

  await act( async () => {
    await result.current.initialize()
  })

  const { result: anecdoteResult } = renderHook(() => useAnecdotes())

  expect(anecdoteResult.current).toEqual(mockAnecdotes)
})

test('anecdotes are sorted by votes', () => {
  const anecdotes = mockAnecdotes.map(anecdote => {
    if(anecdote.id === 2) {
      return { ...anecdote, votes: 2}
    }
    if(anecdote.id === 3) {
      return { ...anecdote, votes: 1}
    }
    return anecdote
  })

  useAnecdoteStore.setState({ anecdotes: anecdotes })


  const { result: anecdoteResult } = renderHook(() => useAnecdotes())
  expect(anecdoteResult.current[0].votes).toBe(2)
  expect(anecdoteResult.current[1].votes).toBe(1)
  expect(anecdoteResult.current[2].votes).toBe(0)
})

test('returns only anecdotes matching the filter', () => {
  useAnecdoteStore.setState({ anecdotes: mockAnecdotes, filter: 'second'})
  const { result } = renderHook(() => useAnecdotes())

  expect(result.current).toHaveLength(1)
  expect(result.current).toEqual([mockAnecdotes[1]])
})

test('voting increases the anecdote votes', async () => {
  useAnecdoteStore.setState({ anecdotes: mockAnecdotes})

  anecdoteService.update.mockResolvedValue({...mockAnecdotes[1], votes: 1 })
  const { result: controls } = renderHook(() => useAnecdoteActions())

  await act(async () => {
    await controls.current.vote(2)
  })

  expect(anecdoteService.update).toHaveBeenCalledWith(2, { content: 'secondOne', votes: 1, id: 2 })
    
  const { result: anecdoteResult } = renderHook(() => useAnecdotes())
  const votedAnecdote = anecdoteResult.current.find(a => a.id === 2)
  expect(votedAnecdote.votes).toBe(1)
})
