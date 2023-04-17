const express = require('express');
const asyncHandler = require("express-async-handler");
const commentController = require('../controllers/comment.controller')
const authenticate = require('../middlewares/authenticate.middleware')

const router = express.Router()

router.route("/comments/:slug").get(asyncHandler(commentController.getArticleComments))
router.route("/comments/:slug").post(authenticate, asyncHandler(commentController.addCommentToArticle))
router.route("/comments/replies/:slug").get(asyncHandler(commentController.getCommentReplies))
router.route("/comments/replies/:slug").post(authenticate, asyncHandler(commentController.replyToComment))
router.route("/comments/:slug").delete(asyncHandler(commentController.deleteComment))
router.route("/comments/:slug").put(asyncHandler(commentController.updateComment))


module.exports = router