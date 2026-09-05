import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const createComment = async(id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  return await axios.delete(`${baseUrl}/${id}`, config)
}

const update = async (blogToUpdate) => {
  const response = await axios.put(`${baseUrl}/${blogToUpdate.id}`, blogToUpdate)
  return response.data
}

export default { getAll, create, createComment, update, remove, setToken }