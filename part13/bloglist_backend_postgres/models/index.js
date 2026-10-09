const Blog = require('./blog.js')
const User = require('./user.js')
const ReadingList = require('./reading_list.js')
const Session = require('./session.js')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = { User, Blog, ReadingList, Session }