const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if(!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

const createNew = async (content) => {
  const postOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 })
  }

  const response = await fetch(baseUrl, postOptions)

  if(!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return await response.json()
}

const update = async (id, anecdote) => {
  const putOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(anecdote)
  }
  
  const response = await fetch(`${baseUrl}/${id}`, putOptions)

  if(!response.ok) {
    throw new Error('Failed to update anecdote')
  }

  return await response.json()
}

export default { getAll, createNew, update }