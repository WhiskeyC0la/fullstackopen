const { test, after, beforeEach } = require('node:test')
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

after(async () => {
  await mongoose.connection.close()
})