const express = require('express');
const asyncHandler = require("express-async-handler");
const categoryController = require('../controllers/category.controller')

const router = express.Router()

router.route("/popular-categories").get(asyncHandler(categoryController.getPopularCategories))

module.exports = router