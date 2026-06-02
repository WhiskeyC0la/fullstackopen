const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogs = require('./test_blogs')
const Blog = require('../models/blog')
const { blogsInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, blogs.length)
  })

  test('blogs have id field', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('POST /api/blogs', () => {
  test('a new blog can be added', async () => {
    const newBlog = {
      title: 'test',
      author: 'Test Author',
      url: 'Not exist',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogs.length + 1)
    const blogTitles = blogsAtEnd.map(blog => blog.title)
    assert(blogTitles.includes(newBlog.title))
  })

  test('POST without likes field set by default zero', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'http://test.example'
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const recentlySavedBlog = blogsAtEnd.find(blog => blog.id === result.body.id)
    assert.strictEqual(recentlySavedBlog?.likes, 0)
  })

  describe('validation', () => {
    test('creation fails without title', async () => {
      const newBlogWithoutTitle = {
        author: 'Test Author',
        url: 'http://test.example'
      }
      await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400)
    })

    test('creation fails without url', async () => {
      const newBlogWithoutUrl = {
        title: 'Test without URL',
        author: 'Test Author'
      }
      await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400)
    })
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('success with 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    const ids = blogsAtEnd.map(blog => blog.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('fail with 400 if id isn\'t valid', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .delete('/api/blogs/123')
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
  })

  test('fail with 404 if id is valid but not found', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDeleteId = blogsAtStart[0].id.replace(/\d/g, '1')

    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .expect(404)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updating the blog\'s likes', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdateId = blogsAtStart[0].id
    const blogToUpdateLikes = blogsAtStart[0].likes
    const updatedLikes = blogToUpdateLikes + 5

    await api
      .put(`/api/blogs/${blogToUpdateId}`)
      .send({ likes: updatedLikes })
      .expect(200)

    const blogsAtEnd = await blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdateId)

    assert.strictEqual(updatedBlog.likes, updatedLikes)
  })
})

after(async () => {
  await mongoose.connection.close()
})