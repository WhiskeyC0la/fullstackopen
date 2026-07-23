import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  beforeEach(() => {
    blog = {
      title: 'Test content',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 5,
      user: {
        name: 'Test User',
        username: 'tester'
      }
    }
  })

  test('renders blog information and no buttons for unauthenticated user', () => {
    render(<Blog blog={blog}/>)

    const blogTitle = screen.getByText('Test content', { exact: false })
    const blogAuthor = screen.getByText('Test Author', { exact: false })
    const blogUrl = screen.getByText('https://example.com')
    const blogLikes = screen.getByText('likes 5', { exact: false })
    const blogUser = screen.getByText('Test User', { exact: false })
    const likeButton = screen.queryByRole('button', { name: /like/i })
    const removeButton = screen.queryByRole('button', { name: /remove/i })

    expect(blogTitle).toBeVisible()
    expect(blogAuthor).toBeVisible()
    expect(blogUrl).toBeVisible()
    expect(blogLikes).toBeVisible()
    expect(blogUser).toBeVisible()
    expect(likeButton).not.toBeInTheDocument()
    expect(removeButton).not.toBeInTheDocument()
  })

  test('renders only like button for authenticated non-owner', () => {
    const user = {
      name: 'Test User2',
      username: 'tester2'
    }

    render(<Blog blog={blog} user={user}/>)

    const likeButton = screen.getByRole('button', { name: /like/i })
    const removeButton = screen.queryByRole('button', { name: /remove/i })

    expect(likeButton).toBeInTheDocument()
    expect(removeButton).not.toBeInTheDocument()
  })

  test('renders like and remove buttons for blog owner', () => {
    const user = {
      name: 'Test User',
      username: 'tester'
    }

    render(<Blog blog={blog} user={user}/>)

    const likeButton = screen.getByRole('button', { name: /like/i })
    const removeButton = screen.getByRole('button', { name: /remove/i })

    expect(likeButton).toBeInTheDocument()
    expect(removeButton).toBeInTheDocument()
  })
})
