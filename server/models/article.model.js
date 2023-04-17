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
  }],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: false
    }
  ],
}, {timestamps: true})

article.plugin(mongoosePaginate)

article.methods.addComment = function(id) {
  this.comments.push(id)
  return this.save()
}

module.exports = model('Article', article)