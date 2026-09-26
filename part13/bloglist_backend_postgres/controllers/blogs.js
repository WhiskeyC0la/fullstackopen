const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByPk(request.params.id)

    if(!blog) {
      return response.status(404).end()
    }

    await blog.destroy()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try{
    const { likes } = request.body
    const blogToUpdate = await Blog.findByPk(request.params.id)

    if(!blogToUpdate) {
      return response.status(404).end()
    }

    blogToUpdate.likes = likes

    const updatedBlog = await blogToUpdate.save()
    return response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter