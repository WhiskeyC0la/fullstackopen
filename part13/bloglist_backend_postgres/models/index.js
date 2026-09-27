const Blog = require('./blog.js')

const syncModels = async () => {
  await Blog.sync()
}

module.exports = { Blog, syncModels }