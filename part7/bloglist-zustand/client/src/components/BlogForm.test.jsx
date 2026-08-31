import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls addBlog with correct details when form is submitted',
  async () => {
    const addBlogMock = vi.fn()

    render(<BlogForm addBlog={addBlogMock} />)

    const tester = userEvent.setup()
    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const submitButton = screen.getByText('create')

    await tester.type(titleInput, 'Test Blog')
    await tester.type(authorInput, 'Test Author')
    await tester.type(urlInput, 'https://example.com')
    await tester.click(submitButton)

    expect(addBlogMock.mock.calls).toHaveLength(1)
    // Option 1: check individual properties. Alternative approach.
    // expect(addBlogMock.mock.calls[0][0].title).toBe('Test Blog')
    // expect(addBlogMock.mock.calls[0][0].author).toBe('Test Author')
    // expect(addBlogMock.mock.calls[0][0].url).toBe('https://example.com')

    // Option 2: check the whole object. Preferred approach.
    expect(addBlogMock.mock.calls[0][0]).toStrictEqual(
      {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://example.com'
      }
    )
  })