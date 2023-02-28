const express = require('express');
const asyncHandler = require("express-async-handler");
const userController = require('../controllers/user.controller')
const authenticate = require('../middlewares/authenticate.middleware')

const router = express.Router()

router.route("/user").get(authenticate, asyncHandler(userController.getCurrentUser))
router.route("/user/:slug").get(asyncHandler(userController.getUserById))
router.route("/user/articles/:slug").get(asyncHandler(userController.getUserArticles))

module.exports = router