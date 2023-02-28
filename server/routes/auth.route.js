const express = require('express');
const asyncHandler = require("express-async-handler");
const authController = require('../controllers/auth.controller')

const router = express.Router()

router.route("/auth/login").post(asyncHandler(authController.login))
router.route("/auth/register").post(asyncHandler(authController.register))

module.exports = router