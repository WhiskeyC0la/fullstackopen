const { DATABASE_URL } = require('./config.js')
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const migrationConfig = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map(mig => mig.name)
  })
}

const rollBackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConfig)
  await migrator.down()
}

const connectToDatabase = async () => {
  await sequelize.authenticate()
  await runMigrations()
  console.log('connected to the database')
}

module.exports = { sequelize, connectToDatabase, rollBackMigration }