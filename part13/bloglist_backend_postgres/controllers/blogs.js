const blogsRouter = require('express').Router()
const { Blog } = require('../models')
const { blogFinder } = require('../utils/middleware.js')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.findAll()

    response.json(blogs)
  }catch(error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const blog = Blog.build({
      title: body.title,
      author: body.author,
      url: body.url
    })
    const savedBlog = await blog.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', blogFinder, async (request, response, next) => {
  try {
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
    return response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter