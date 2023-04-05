const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const article = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  title: {
    type: String,
    require: true,
    unique: true
  },
  quickSummary: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  favoritesCount: {
    type: Number,
    require: true,
    default: 0
  },
  sourceLink: {
    type: String,
    require: true
  },
  categories: [{
    type: String
  }]
}, {timestamps: true})

article.plugin(mongoosePaginate)

module.exports = model('Article', article)