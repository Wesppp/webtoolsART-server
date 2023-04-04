const { Schema, model } = require('mongoose')

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

module.exports = model('Article', article)