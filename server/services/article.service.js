const Article = require('../models/article.model')
const ObjectId = require('mongodb').ObjectId
const User = require('../models/users.model')
const Comment = require('../models/comment.model')

exports.getAllArticles = async function(query) {
  try {
    const { pageNumber = 1, pageSize = 10 } = query

    const options = {
      page: pageNumber,
      limit: pageSize,
      populate: 'author',
    }

    const { docs } = await Article.paginate({}, options);
    const articlesCount = await Article.count()
    return { articles: docs, articlesCount }
  } catch(err) {
    throw err
  }
}

exports.addNewArticle = async function(user, reqBody) {
  try {
    const { _id: userId } = user
    reqBody.author = userId

    const newArticle = new Article(reqBody)
    await newArticle.save()

    const { _id: articleId } = newArticle
    await user.addArticle(articleId)

    return newArticle
  } catch(err) {
    if (err.code === 11000 && err.keyPattern.title) {
      err.message = 'An article with this title already exists!';
    }

    throw err
  }
}

exports.getArticleById = async function(articleId) {
  try {
    return await Article.findById(articleId).populate('author')
  } catch(err) {
    throw err
  }
}

exports.updateArticle = async function(articleId, reqBody) {
  try {
    return await Article.findByIdAndUpdate(articleId, reqBody)
  } catch(err) {
    if (err.code === 11000 && err.keyPattern.title) {
      err.message = 'An article with this title already exists!';
    }

    throw err
  }
}

exports.deleteArticle = async function(articleId, user) {
  try {
    const article = await Article.findById(articleId)

    await Comment.deleteMany({ _id: { $in: article.comments } })

    const isDeleted = await Article.deleteOne({ _id: new ObjectId(articleId) })
    
    await user.removeArticle(articleId)
    await User.updateMany({ favoritesArticles: articleId }, { $pull: { favoritesArticles: articleId } })

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

exports.getFavoritesArticles = async function(userId, query) {
  try {
    const { pageNumber = 1, pageSize = 10 } = query

    const options = {
      page: pageNumber,
      limit: pageSize,
      populate: 'author',
    }

    const { favoritesArticles } = await User.findById(userId).populate('favoritesArticles');
    const articles = await Article.paginate({ _id: { $in: favoritesArticles } }, options);

    return { articles: articles.docs, articlesCount: articles.totalDocs };
  } catch(err) {
    throw err
  }
}

exports.getArticlesByCategory = async function(category, query) {
  try {
    const { pageNumber = 1, pageSize = 10 } = query

    const options = {
      page: pageNumber,
      limit: pageSize,
      populate: 'author',
    }

    const articles = await Article.paginate({ categories: category }, options);

    return { articles: articles.docs, articlesCount: articles.totalDocs };
  } catch(err) {
    throw err
  }
}