import { useBlogs } from '../hooks/useBlogs'
import { Notification } from './Notification'
import { Link } from 'react-router-dom'
const Blogs = () => {
  const { blogs, isPending, isError } = useBlogs()

  if(isError) {
    return <h2>Blog service is not available due to problems on the server</h2>
  }

  if(isPending) {
    return <h2>Loading...</h2>
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification />
      <ul>
        {blogs.map(blog => (
          <li key={blog.id} >
            <Link to={`/blogs/${blog.id}`}>
              {`${blog.title} by ${blog.author}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs