const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, Blog } = require('../models')

usersRouter.get('/', async (request, response, next) => {
  try{
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    })

    response.status(200).json(users)
  }catch(error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if(!password || password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = User.build({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch(error) {
    next(error)
  }
})

usersRouter.put('/:username', async (request, response, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: request.params.username
      }
    })
    if(!user) {
      return response.status(404).end()
    }
    const { name } = request.body
    user.name = name
    const updatedUser = await user.save()
    response.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findByPk(request.params.id, {
      include: {
        model: Blog,
        attributes: {
          exclude: ['userId']
        }
      }
    })
    if(!user) {
      return response.status(404).end()
    }
    response.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter