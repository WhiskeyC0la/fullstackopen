const Blog = ({ blog, updateLikes, deleteBlog, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if(!blog) {
    return null
  }

  return (
    <div style={blogStyle}>
      <h3>
        {`${blog.author}: ${blog.title}`}
      </h3>
      <div>
        <p>{blog.url}</p>
        <p>
        likes {blog.likes}
          {user && (
            <button onClick={() => updateLikes(blog.id)}>like</button>
          )}
        </p>
        <p>{blog.user.name}</p>
        {user && blog.user.username === user.username && (
          <button onClick={() => deleteBlog(blog.id)}>remove</button>
        )}
      </div>
    </div>
  )}

export default Blog