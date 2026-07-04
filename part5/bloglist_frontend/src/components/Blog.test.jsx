import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let updateLikesMock
  beforeEach(() => {
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

    updateLikesMock = vi.fn()

    render(<Blog blog={blog} user={user} updateLikes={updateLikesMock}/>)
  })

  test('component renders title and author only', () => {

    const blogTitle = screen.getByText('Test content', { exact: false })
    const blogAuthor = screen.getByText('Test Author', { exact: false })
    const blogUrl = screen.getByText('https://example.com')
    const blogLikes = screen.getByText('likes 5', { exact: false })
    const blogUser = screen.getByText('Test User', { exact: false })

    expect(blogTitle).toBeVisible()
    expect(blogAuthor).toBeVisible()
    expect(blogUrl).not.toBeVisible()
    expect(blogLikes).not.toBeVisible()
    expect(blogUser).not.toBeVisible()
  })

  test('after clicking the button, url, likes and user are displayed',
    async () => {

      const tester = userEvent.setup()
      const button = screen.getByText('view')
      await tester.click(button)

      const blogUrl = screen.getByText('https://example.com')
      const blogLikes = screen.getByText('likes 5', { exact: false })
      const blogUser = screen.getByText('Test User', { exact: false })

      expect(blogUrl).toBeVisible()
      expect(blogLikes).toBeVisible()
      expect(blogUser).toBeVisible()
    })

  test('clicking like button twice calls event handler twice',
    async () => {

      const tester = userEvent.setup()

      const viewButton = screen.getByText('view')
      await tester.click(viewButton)

      const likeButton = screen.getByText('like')
      await tester.click(likeButton)
      await tester.click(likeButton)

      expect(updateLikesMock.mock.calls).toHaveLength(2)
    })
})
