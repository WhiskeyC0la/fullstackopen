const authorsRouter = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../utils/db.js')
authorsRouter.get('/', async (request, response, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [
          sequelize.fn('COUNT', sequelize.col('id')),
          'blogs'
        ],
        [
          sequelize.fn('SUM', sequelize.col('likes')),
          'likes'
        ]
      ],
      group: ['author'],
      order: [
        [
          sequelize.fn('SUM', sequelize.col('likes')),
          'DESC'
        ]
      ]
    })
    response.status(200).json(authors)
  } catch(error) {
    next(error)
  }
})

module.exports = authorsRouter