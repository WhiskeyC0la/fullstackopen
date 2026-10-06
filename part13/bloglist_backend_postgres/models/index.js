const Blog = require('./blog.js')
const User = require('./user.js')

User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = { User, Blog }