import { useState } from 'react'
import { useAnecdotes } from './useAnecdotes'

export const useField = (type) => {
  const [ value, setValue ] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export { useAnecdotes }