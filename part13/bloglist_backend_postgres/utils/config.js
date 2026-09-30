require('dotenv').config()

const PORT = process.env.TESTING === 'true'
  ? 3001
  : process.env.PORT
const DATABASE_URL = process.env.TESTING === 'true'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

module.exports = { DATABASE_URL, PORT }