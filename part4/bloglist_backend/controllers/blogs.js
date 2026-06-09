const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.find({}).populate('user', 'username name')

    response.json(blogs)
  }catch(error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const user = await User.findById(request.body.user)
    if(!user) {
      return response.status(400).json({ error: 'user id missing or not valid' })
    }

    const blog = new Blog(request.body)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

    if(!deletedBlog) {
      return response.status(404).end()
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
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
    next(error)
  }
})

module.exports = blogsRouter