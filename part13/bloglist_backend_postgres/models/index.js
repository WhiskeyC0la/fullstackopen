const Blog = require('./blog.js')
const User = require('./user.js')

User.hasMany(Blog)
Blog.belongsTo(User)

const syncModels = async () => {
  await User.sync({ alter: true })
  await Blog.sync({ alter: true })
}

module.exports = { User, Blog, syncModels }