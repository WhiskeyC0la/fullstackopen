const testingRouter = require('express').Router()
const { Blog, User } = require('../models')

testingRouter.post('/reset', async (request, response) => {
  await Blog.destroy({
    where: {}
  })
  await User.destroy({
    where: {}
  })

  response.status(204).end()
})

module.exports = testingRouter