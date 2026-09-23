require ('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const main = async () => {
  try {
    const blogs = await sequelize.query('select * from blogs', { type: QueryTypes.SELECT })
    blogs.forEach(blog =>
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    )
    await sequelize.close()
  } catch(error) {
    console.error('Database error:', error.message)
  } finally {
    await sequelize.close()
  }
}

main()