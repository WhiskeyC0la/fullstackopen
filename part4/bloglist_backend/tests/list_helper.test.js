const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const { totalLikes } = require('../utils/list_helper')
const blogs = require('./test_blogs')

describe('total likes', () => {
  test('when list is empty, result is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })
  test('when list has only one blog, total likes equal the likes of that blog', () => {
    const listWithOneBlog = [
      {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
      }
    ]
    assert.strictEqual(totalLikes(listWithOneBlog), 7)
  })
  test('when list is bigger, likes are calculated correctly', () => {
    assert.strictEqual(totalLikes(blogs), 36)
  })
})