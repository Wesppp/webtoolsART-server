const Article = require('../models/article.model')
const AppError = require('../utils/appError')
const ObjectId = require('mongodb').ObjectId
const User = require('../models/users.model')
const AsyncLock = require('async-lock');
const lock = new AsyncLock();

exports.getAllArticles = async function() {
  try {
    const articles = await Article.find().populate('author')
    const articlesCount = await Article.count()
    return { articles, articlesCount }
  } catch(err) {
    throw err
  }
}

exports.addNewArticle = async function(user, reqBody) {
  try {
    const { _id: userId } = user
    const isExistingArticleTitle = !!await Article.findOne({title: reqBody.title})

    if(isExistingArticleTitle) { throw new AppError('An article with this title already exists.', 400) }

    reqBody.author = userId

    const newArticle = new Article(reqBody)
    await newArticle.save()

    const { _id: articleId } = newArticle
    await user.addArticle(articleId)

    return newArticle
  } catch(err) {
    console.log(err);
    throw err
  }
}

exports.getArticleById = async function(articleId) {
  try {
    const article = await Article.findById(articleId).populate('author')
    return article
  } catch(err) {
    throw err
  }
}

exports.updateArticle = async function(articleId, reqBody) {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(articleId, reqBody) 
    await updatedArticle.save()

    return updatedArticle
  } catch(err) {
    throw err
  }
}

exports.deleteArticle = async function(articleId, user) {
  try {
    const isDeleted = await Article.deleteOne({ _id: new ObjectId(articleId) })
    await user.removeArticle(articleId)
    return !!isDeleted.deletedCount
  } catch(err) {
    throw err
  }
}

exports.addArticleToFavorites = async function(articleId, user) {
  try {
    await user.addArticleToFavorites(articleId)

    await Article.updateOne(
      {'_id': articleId},
      {
        $inc: { favoritesCount: 1 }
      }
    )

    return await Article.findById(articleId)
  } catch(err) {
    throw err
  }
}

exports.removeArticleFromFavorite = async function(articleId, user) {
  try {
    await user.removeArticleFromFavorites(articleId)

    await Article.updateOne(
      {'_id': articleId},
      {
        $inc: { favoritesCount: -1 }
      }
    )

    return await Article.findById(articleId)
  } catch(err) {
    throw err
  }
}

exports.getFavoritesArticles = async function(userId) {
  try {
    const { favoritesArticles } = await User.findById(userId).populate('favoritesArticles')

    return { articles: favoritesArticles, articlesCount: favoritesArticles.length }
  } catch(err) {
    throw err
  }
}