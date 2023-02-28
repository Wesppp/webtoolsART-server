const { Schema, model } = require('mongoose')

const article = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  title: {
    type: String,
    require: true
  },
  quickSummary: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  sourceLink: {
    type: String,
    require: true
  }
}, {timestamps: true})

module.exports = model('Article', article)