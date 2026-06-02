const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)

    const result = await blog.save()

    response.status(201).json(result)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

    if(!deletedBlog) {
      return response.status(404).end()
    }
    response.status(204).end()
  } catch (error) {
    console.error(error.message)
    if(error.name === 'CastError') {
      return response.status(400).json({ error: error.message })
    } else return response.status(500).json({ error: error.message })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try{
    const { likes } = request.body
    const blogToUpdate = await Blog.findById(request.params.id)

    if(!blogToUpdate) {
      return response.status(404).end()
    }

    blogToUpdate.likes = likes

    const updatedBlog = await blogToUpdate.save()
    return response.status(200).json(updatedBlog)
  } catch (error) {
    if (error.name === 'CastError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'ValidationError'){
      return response.status(400).json({ error: error.message })
    } else return response.status(500).json({ error: error.message })
  }
})

module.exports = blogsRouter