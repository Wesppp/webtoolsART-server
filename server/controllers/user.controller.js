const userService = require('../services/user.service')

exports.getCurrentUser = async function(req, res) {
  try {
    res.status(200).json(req.user)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.getUserById = async function(req, res) {
  try {
    const user = await userService.getUserById(req.params.slug)
    res.status(200).json(user)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.getUserArticles = async function(req, res) {
  try {
    const articles = await userService.getUserArticles(req.params.slug)
    res.status(200).json(articles)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}