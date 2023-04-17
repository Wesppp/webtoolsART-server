const { Schema, model } = require('mongoose')

const comment = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  text: {
    require: true,
    type: String
  },
  repliesCount: {
    require: true,
    type: Number,
    default: 0
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
}, {timestamps: true})

comment.methods.updateRepliesCount = async function() {
  const repliesCount = await this.constructor.countDocuments({ parentComment: this._id });

  this.repliesCount = repliesCount;
  
  await this.save();
};

module.exports = model('Comment', comment)