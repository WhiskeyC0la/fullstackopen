const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blogs = await Blog.find({}).populate('user', 'username name')

    response.json(blogs)
  }catch(error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const body = request.body
    const user = request.user

    if(!user) {
      return response.status(400).json({ error: 'user id missing or not valid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if(!blog) {
      return response.status(404).end()
    }

    if (!user) {
      return response.status(400).json({ error: 'user id missing or not valid' })
    }

    if(blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'access denied' })
    }

    await Blog.findByIdAndDelete(request.params.id)

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