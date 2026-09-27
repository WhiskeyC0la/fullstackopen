const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { Blog } = require('../models')

const errorHandler = (error, request, response, next) => {
  if(error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'SequelizeDatabaseError') {
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

    request.user = await User.findById(decodedToken.id)
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