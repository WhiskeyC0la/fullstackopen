const { Session } = require('../models')
const logoutRouter = require('express').Router()

logoutRouter.delete('/', async (request, response, next) => {
  try {
    const session = await Session.findOne({
      where: {
        token: request.token
      }
    })
    if(!session) {
      return response.status(401).json({ error: 'session expired or invalid' })
    }
    await Session.destroy({
      where: {
        userId: session.userId
      }
    })
    response.status(204).end()
  } catch(error) {
    next(error)
  }
})

module.exports = logoutRouter