const categoryService = require('../services/category.service')

exports.getPopularCategories = async function(req, res) {
  try {
    const popularCategories = await categoryService.getPopularCategories()
    res.status(200).json(popularCategories)
  } catch(err) {
    res.status(err.status || 500).json({success: false, message: err.message})
  }
}