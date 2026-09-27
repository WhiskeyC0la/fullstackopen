const app = require('./app.js')
const { PORT } = require('./utils/config.js')
const { connectToDatabase } = require('./utils/db.js')
const { syncModels } = require('./models')
const { info } = require('./utils/logger.js')

const start = async () => {
  try {
    await connectToDatabase()
    await syncModels()
    app.listen(PORT, () => {
      info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start application:', error.message)
    process.exit(1)
  }
}

start()