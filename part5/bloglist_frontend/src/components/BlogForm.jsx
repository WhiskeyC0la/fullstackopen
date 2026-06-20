import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const handleBlogTitle = event => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthor = event => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrl = event => {
    setNewBlogUrl(event.target.value)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    await addBlog({
      title: newBlogTitle.trim(),
      author: newBlogAuthor.trim(),
      url: newBlogUrl.trim()
    })
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          title
          <input
            type='text'
            value={newBlogTitle}
            onChange={handleBlogTitle}
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type='text'
            value={newBlogAuthor}
            onChange={handleBlogAuthor}
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type='url'
            value={newBlogUrl}
            onChange={handleBlogUrl}
          />
        </label>
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm