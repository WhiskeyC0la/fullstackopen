const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  if(loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    return user
  } else return null
}

const saveUser = user => {
  window.localStorage.setItem('loggedBlogappUser',
    JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem('loggedBlogappUser')
}

export default { getUser, saveUser, removeUser }