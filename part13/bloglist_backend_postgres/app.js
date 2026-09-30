const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const { errorHandler, tokenExtractor } = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')

app.use(express.json())
app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
app.get('/', (request, response) => {
  response.status(200).end()
})
if (process.env.TESTING === 'true') {
  const testingRouter = require('./controllers/testing')
  app.use('/api', testingRouter)
}
app.use(errorHandler)

module.exports = app