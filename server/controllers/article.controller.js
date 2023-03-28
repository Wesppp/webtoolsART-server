const articleService = require('../services/article.service')

exports.getAllArticles = async function(req, res) {
  try {
    const articles = await articleService.getAllArticles()
    res.status(200).json(articles)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  } 
}

exports.addNewArticle = async function(req, res) {
  try {
    const article = await articleService.addNewArticle(req.user, req.body)
    res.status(200).json(article)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.getArticleById = async function(req, res) {
  try {
    const article = await articleService.getArticleById(req.params.articleId)
    res.status(200).json(article)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.updateArticle = async function(req, res) {
  try {
    const article = await articleService.updateArticle(req.params.articleId, req.body)
    res.status(200).json(article)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.deleteArticle = async function(req, res) {
  try {
    const isDeleted = await articleService.deleteArticle(req.params.articleId, req.user)
    if (isDeleted) { res.status(200).json( {} ) }
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.addArticleToFavorites = async function(req, res) {
  try {
    const article = await articleService.addArticleToFavorites(req.params.slug, req.user)
    res.status(200).json(article)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.removeArticleFromFavorite = async function(req, res) {
  try {
    const article = await articleService.removeArticleFromFavorite(req.params.slug, req.user)
    res.status(200).json(article)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.getFavoritesArticles = async function(req, res) {
  try {
    const articles = await articleService.getFavoritesArticles(req.user._id)
    res.status(200).json(articles)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}