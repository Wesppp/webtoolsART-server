const express = require('express');
const asyncHandler = require("express-async-handler");
const userController = require('../controllers/user.controller')
const authenticate = require('../middlewares/authenticate.middleware')
const upload = require('../middlewares/uploadImage.middleware')
const deletePreviousAvatar = require('../middlewares/deletePreviousAvatar.middleware')

const router = express.Router()

router.route("/user").get(authenticate, asyncHandler(userController.getCurrentUser))
router.route("/user").put(authenticate, asyncHandler(userController.updateUser))
router.route("/user/avatar").post(authenticate, deletePreviousAvatar, upload.single('avatar'), asyncHandler(userController.uploadUserAvatar))
router.route("/user/avatar").delete(authenticate, asyncHandler(userController.deleteUserAvatar))
router.route("/user/:slug").get(asyncHandler(userController.getUserById))
router.route("/user/articles/:slug").get(asyncHandler(userController.getUserArticles))

module.exports = router