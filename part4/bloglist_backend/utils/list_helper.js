const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, item) => acc + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) {
    return {}
  }
  return blogs.reduce((acc, item) => acc.likes < item.likes ? item : acc)
}

module.exports = { dummy, totalLikes, favoriteBlog }