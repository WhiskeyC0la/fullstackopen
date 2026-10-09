const jwt = require('jsonwebtoken')
const { User, Blog, Session } = require('../models')

const errorHandler = (error, request, response, next) => {
  if(error.name === 'SequelizeValidationError') {
    const arrayOfErrorMessages = error.errors.map(errorItem => errorItem.message)
    return response.status(400).json({ error: arrayOfErrorMessages })
  } else if(error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'SyntaxError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  request.token = authorization && authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : null
  next()
}

const userExtractor = async (request, response, next) => {
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findByPk(decodedToken.id)
    if(!user) {
      return response.status(401).end()
    }
    if (user.disabled) {
      return response.status(403).json({ error: 'account disabled' })
    }

    const session = await Session.findOne({
      where: {
        userId: user.id,
        token: request.token
      }
    })
    if(!session) {
      return response.status(401).json({ error: 'session expired or invalid' })
    }

    request.user = user
    next()
  } catch(error) {
    next(error)
  }
}

const blogFinder = async (request, response, next) => {
  try {
    request.blog = await Blog.findByPk(request.params.id)
    if(!request.blog) {
      return response.status(404).end()
    }
    next()
  } catch(error) {
    next(error)
  }
}

module.exports = { errorHandler, tokenExtractor, userExtractor, blogFinder }