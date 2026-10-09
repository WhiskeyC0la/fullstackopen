const testingRouter = require('express').Router()
const { Blog, User, Session, ReadingList } = require('../models')

testingRouter.post('/reset', async (request, response) => {
  await Session.destroy({
    where: {}
  })
  await ReadingList.destroy({
    where: {}
  })
  await Blog.destroy({
    where: {}
  })
  await User.destroy({
    where: {}
  })

  response.status(204).end()
})

module.exports = testingRouter