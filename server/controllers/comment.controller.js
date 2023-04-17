const commentService = require('../services/comment.service')

exports.addCommentToArticle = async function(req, res) {
  try {
    const comment = await commentService.addCommentToArticle(req.user, req.params, req.body)
    res.status(200).json(comment)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.getArticleComments = async function(req, res) {
  try {
    const comments = await commentService.getArticleComments(req.params)
    res.status(200).json(comments)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.deleteComment = async function(req, res) {
  try {
    const comment = await commentService.deleteComment(req.params)
    res.status(200).json(comment)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.updateComment = async function (req, res) {
  try {
    const comment = await commentService.updateComment(req.params, req.body)
    res.status(200).json(comment)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.replyToComment = async function(req, res) {
  try {
    const comment = await commentService.replyToComment(req.user, req.params, req.body)
    res.status(200).json(comment)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}

exports.getCommentReplies = async function(req, res) {
  try {
    const replies = await commentService.getCommentReplies(req.params)
    res.status(200).json(replies)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}