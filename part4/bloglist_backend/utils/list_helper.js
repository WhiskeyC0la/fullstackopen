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

const mostBlogs = (blogs) => {
  if(blogs.length === 0) {
    return {}
  }
  const authors = blogs.reduce((authors, item) => {
    authors[item.author] ? authors[item.author] +=1 : authors[item.author] = 1
    return authors
  },{})

  let favoriteAuthor = ''
  let maxBlogs = 0

  for(let author in authors) {
    if(authors[author] > maxBlogs) {
      maxBlogs = authors[author]
      favoriteAuthor = author
    }
  }
  return {
    author: favoriteAuthor,
    blogs: maxBlogs
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }