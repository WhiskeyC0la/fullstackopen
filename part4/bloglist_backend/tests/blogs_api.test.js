const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogs = require('./test_blogs')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { blogsInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const passwordHash = await bcrypt.hash('confidential', 10)
  const testUser = new User({
    username: 'jackflow',
    name: 'Jack Flow',
    passwordHash: passwordHash
  })
  const savedUser = await testUser.save()
  const blogsWithUser = blogs.map(blog => ({ ...blog, user: savedUser._id }))

  const savedBlogs = await Blog.insertMany(blogsWithUser)
  const savedBlogsIds = savedBlogs.map(blog => blog._id)
  testUser.blogs = savedBlogsIds
  await testUser.save()
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
    const credentialsForLogin = {
      username: 'jackflow',
      password: 'confidential'
    }
    const loginResult = await api
      .post('/api/login')
      .send(credentialsForLogin)

    const newBlog = {
      title: 'test',
      author: 'Test Author',
      url: 'Not exist',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResult.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogs.length + 1)
    const blogTitles = blogsAtEnd.map(blog => blog.title)
    assert(blogTitles.includes(newBlog.title))
  })

  test('a new blog can\'t be added without token', async () => {

    const newBlog = {
      title: 'test',
      author: 'Test Author',
      url: 'Not exist',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogs.length)
    const blogTitles = blogsAtEnd.map(blog => blog.title)
    assert(!blogTitles.includes(newBlog.title))
  })

  test('POST without likes field set by default zero', async () => {
    const credentialsForLogin = {
      username: 'jackflow',
      password: 'confidential'
    }
    const loginResult = await api
      .post('/api/login')
      .send(credentialsForLogin)

    const newBlogWithoutLikes = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'http://test.example'
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResult.body.token}`)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    const recentlySavedBlog = blogsAtEnd.find(blog => blog.id === result.body.id)
    assert.strictEqual(recentlySavedBlog?.likes, 0)
  })

  describe('validation', () => {
    test('creation fails without title', async () => {
      const credentialsForLogin = {
        username: 'jackflow',
        password: 'confidential'
      }
      const loginResult = await api
        .post('/api/login')
        .send(credentialsForLogin)

      const newBlogWithoutTitle = {
        author: 'Test Author',
        url: 'http://test.example'
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResult.body.token}`)
        .send(newBlogWithoutTitle)
        .expect(400)
    })

    test('creation fails without url', async () => {
      const credentialsForLogin = {
        username: 'jackflow',
        password: 'confidential'
      }
      const loginResult = await api
        .post('/api/login')
        .send(credentialsForLogin)

      const newBlogWithoutUrl = {
        title: 'Test without URL',
        author: 'Test Author'
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${loginResult.body.token}`)
        .send(newBlogWithoutUrl)
        .expect(400)
    })
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('success with 204 if id is valid', async () => {
    const credentialsForLogin = {
      username: 'jackflow',
      password: 'confidential'
    }
    const loginResult = await api
      .post('/api/login')
      .send(credentialsForLogin)

    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginResult.body.token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    const ids = blogsAtEnd.map(blog => blog.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('fail with 400 if id isn\'t valid', async () => {
    const credentialsForLogin = {
      username: 'jackflow',
      password: 'confidential'
    }
    const loginResult = await api
      .post('/api/login')
      .send(credentialsForLogin)

    const blogsAtStart = await blogsInDb()

    await api
      .delete('/api/blogs/123')
      .set('Authorization', `Bearer ${loginResult.body.token}`)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
  })

  test('fail with 404 if id is valid but not found', async () => {
    const credentialsForLogin = {
      username: 'jackflow',
      password: 'confidential'
    }
    const loginResult = await api
      .post('/api/login')
      .send(credentialsForLogin)

    const blogsAtStart = await blogsInDb()
    const blogToDeleteId = blogsAtStart[0].id.replace(/\d/g, '1')

    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .set('Authorization', `Bearer ${loginResult.body.token}`)
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