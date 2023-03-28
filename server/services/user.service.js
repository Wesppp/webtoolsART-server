const User = require('../models/users.model')
const AppError = require('../utils/appError')
const fs = require("fs");

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

exports.updateUser = async function(userId, reqBody) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, reqBody)
    await updatedUser.save()

    return updatedUser
  } catch(err) {
    throw(err)
  }
}

exports.uploadUserAvatar = async function(userId, file) {
  try {
    const user = await User.findById(userId)

    user.profileImage = file.path
    user.save()

    return user
  } catch(err) {
    throw err
  }
}

exports.deleteUserAvatar = async function(userId) {
  try {
    const user = await User.findById(userId)

    if(!user.profileImage) { throw new AppError('No images to delete found.', 400) }

    fs.unlink(user.profileImage, function(err) {
      if (err) { throw err }
    })

    user.profileImage = ''
    await user.save()

    return user
  } catch(err) {
    throw err
  }
}