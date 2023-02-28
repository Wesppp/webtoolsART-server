const User = require('../models/users.model')
const AppError = require('../utils/appError')

exports.getUserById = async function(userId) {
  try {
    const user = await User.findById(userId)

    await user.save()

    if (!user) { throw new AppError('No such user was found.', 400) }

    return { user, articlesCount: user.articles.length }
  } catch(err) {
    throw err
  }
}

exports.getUserArticles = async function(userId) {
  try {
    const { articles } = await User.findById(userId).populate('articles')

    return { articles, articlesCount: articles.length }
  } catch(err) {
    throw err
  }
}