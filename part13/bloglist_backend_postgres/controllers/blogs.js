const blogsRouter = require('express').Router()
const { User, Blog } = require('../models')
const { userExtractor, blogFinder } = require('../utils/middleware.js')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      }
    })

    response.json(blogs)
  }catch(error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const body = request.body

    const blog = Blog.build({
      title: body.title,
      author: body.author,
      url: body.url,
      userId: request.user.id
    })
    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, blogFinder, async (request, response, next) => {
  try {
    if(request.blog.userId !== request.user.id) {
      return response.status(403).end()
    }
    await request.blog.destroy()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', blogFinder, async (request, response, next) => {
  try{
    const { likes } = request.body

    request.blog.likes = likes

    const updatedBlog = await request.blog.save()
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter