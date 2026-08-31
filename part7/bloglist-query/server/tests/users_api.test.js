const { beforeEach, describe, test, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { usersInDb } = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('creation fails with incorrect input data', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'jackflow', passwordHash })
    await user.save()
  })

  test('of user creation without username', async () => {
    const userToCreate = {
      name: 'Jack Flow',
      password: 'superconfidential'
    }
    const usersAtStart = await usersInDb()
    const result = await api
      .post('/api/users')
      .send(userToCreate)
      .expect(400)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('username is required'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('of user creation with short username', async () => {
    const userToCreate = {
      username: 'jf',
      name: 'Jack Flow',
      password: 'superconfidential'
    }
    const usersAtStart = await usersInDb()
    const result = await api
      .post('/api/users')
      .send(userToCreate)
      .expect(400)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('username must be at least 3 characters long'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('of user creation with duplicate username', async () => {
    const userToCreate = {
      username: 'jackflow',
      name: 'Jack Flow',
      password: 'superconfidential'
    }
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send(userToCreate)
      .expect(400)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('of user creation without password', async () => {
    const userToCreate = {
      username: 'jackflo',
      name: 'Jack Flow'
    }
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send(userToCreate)
      .expect(400)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('password must be at least 3 characters long'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('of user creation with short password', async () => {
    const userToCreate = {
      username: 'jackflo',
      name: 'Jack Flow',
      password: 'sc'
    }
    const usersAtStart = await usersInDb()

    const result = await api
      .post('/api/users')
      .send(userToCreate)
      .expect(400)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('password must be at least 3 characters long'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})