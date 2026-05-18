const mongoose = require('mongoose')
const { info, error } = require('../utils/logger')
const { MONGODB_URI } = require('../utils/config')

mongoose.set('strictQuery', false)

info('Connecting to MongoDB...')

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(() => {
    info('Connected to MongoDB')
  })
  .catch(err => {
    error('Error connecting to MongoDB', err.message)
  })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema, 'blogs')