const express = require('express');
const asyncHandler = require("express-async-handler");
const articleController = require('../controllers/article.controller')
const authenticate = require('../middlewares/authenticate.middleware')

const router = express.Router()

router.route("/articles").get(asyncHandler(articleController.getAllArticles))
router.route("/articles/:articleId").get(asyncHandler(articleController.getArticleById))
router.route("/articles/:articleId").put(asyncHandler(articleController.updateArticle))
router.route("/articles/:articleId").delete(authenticate, asyncHandler(articleController.deleteArticle))
router.route("/articles").post(authenticate, asyncHandler(articleController.addNewArticle))

module.exports = router