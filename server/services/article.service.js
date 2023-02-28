const Article = require('../models/article.model')
const AppError = require('../utils/appError')
const ObjectId = require('mongodb').ObjectId

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
    await Article.updateOne(
      {'_id': articleId},
      {
        $set: {
          title: reqBody.title,
          quickSummary: reqBody.quickSummary,
          description: reqBody.description,
          sourceLink: reqBody.sourceLink,
        }
      }
    )

    return await Article.findById(articleId)
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