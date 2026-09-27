const { DATABASE_URL } = require('./config.js')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const connectToDatabase = async () => {
  await sequelize.authenticate()
  console.log('connected to the database')
}

module.exports = { sequelize, connectToDatabase }