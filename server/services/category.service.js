const Article = require('../models/article.model')

exports.getPopularCategories = async function() {
  try {
    let popularTags = await Article.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 12 }
    ])

    return popularTags.map(tag => tag._id)
  } catch(err) {
    throw err
  }
}