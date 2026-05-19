const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, item) => acc + item.likes, 0)
}

module.exports = { dummy, totalLikes }