const readingListsRouter = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const { userExtractor } = require('../utils/middleware.js')

readingListsRouter.post('/', async (request, response, next) => {
  try {
    const { blogId, userId } = request.body
    if(!blogId || !userId) {
      return response.status(400).json({ error: 'blog id and user id are required' })
    }
    const existingUser = await User.findByPk(userId)
    if(!existingUser) {
      return response.status(404).json({ error: 'invalid user id' })
    }

    const existingBlog = await Blog.findByPk(blogId)
    if(!existingBlog) {
      return response.status(404).json({ error: 'invalid blog id' })
    }

    const existingEntry = await ReadingList.findOne({
      where: {
        userId,
        blogId
      }
    })
    if(existingEntry) {
      return response.status(400).json({ error: 'blog is already added to reading list' })
    }

    const entry = ReadingList.build({
      userId: userId,
      blogId: blogId
    })

    const savedEntry = await entry.save()
    response.status(201).json({
      id: savedEntry.id,
      user_id: savedEntry.userId,
      blog_id: savedEntry.blogId,
      read: savedEntry.read
    })
  } catch(error) {
    next(error)
  }
})

readingListsRouter.put('/:id', userExtractor, async (request, response, next) => {
  try{
    const { read } = request.body
    const id = request.params.id

    const readingListEntry = await ReadingList.findByPk(id)
    if(!readingListEntry) {
      return response.status(404).json({ error: 'invalid reading list id' })
    }
    if(readingListEntry.userId !== request.user.id) {
      return response.status(401).json({ error: 'operation not allowed' })
    }

    readingListEntry.read = read
    await readingListEntry.save()
    response.status(200).json(readingListEntry)
  } catch(error) {
    next(error)
  }
})

module.exports = readingListsRouter