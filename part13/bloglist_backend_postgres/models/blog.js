const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db.js')

class Blog extends Model{}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      isInRange(value) {
        if(value === null || value === undefined) {
          return
        }
        const currentYear = new Date().getFullYear()
        if(value < 1991 || value > currentYear) {
          throw new Error(`Year must be between 1991 and ${currentYear}`)
        }
      }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog