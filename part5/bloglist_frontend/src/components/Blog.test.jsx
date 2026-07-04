import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('component renders title & author only', () => {
  const blog = {
    title: 'Test content',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'tester'
    }
  }

  const user = {
    name: 'Test User',
    username: 'tester'
  }

  render(<Blog blog={blog} user={user}/>)

  const blogTitle = screen.getByText('Test content', { exact: false })
  const blogAuthor = screen.getByText('Test Author', { exact: false })
  const blogUrl = screen.getByText('https://example.com')
  const blogLikes = screen.getByText('likes 5', { exact: false })

  expect(blogTitle).toBeVisible()
  expect(blogAuthor).toBeVisible()
  expect(blogUrl).not.toBeVisible()
  expect(blogLikes).not.toBeVisible()
})