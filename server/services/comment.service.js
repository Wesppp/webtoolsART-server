const Comment = require('../models/comment.model')
const Article = require('../models/article.model')

function countComments(comments) {
  let count = comments.length

  for (const comment of comments) {
    count += comment.repliesCount;
  }

  return count;
}

exports.addCommentToArticle = async function(user, params, reqBody) {
  try {
    const comment = new Comment({
      author: user._id,
      text: reqBody.text
    })
    await comment.save()

    const article = await Article.findById(params.slug)
    await article.addComment(comment._id)

    await comment.populate('author')

    return comment
  } catch(err) {
    throw err
  }
}

exports.getArticleComments = async function(params) {
  try {
    const { slug } = params;
    const { comments } = await Article.findById(slug).populate({
      path: 'comments',
      populate: {
        path: 'author'
      }
    });

    const commentsCount = countComments(comments)

    return { comments, commentsCount };
  } catch(err) {
    throw err
  }
}

exports.deleteComment = async function(params) {
  try {
    const { slug } = params
    const deletedComment = await Comment.findByIdAndDelete(slug)

    if (deletedComment.parentComment) {
      const parentComment = await Comment.findById(deletedComment.parentComment)
      await parentComment.updateRepliesCount()
    }

    await Comment.deleteMany({ parentComment: deletedComment._id })
    await Article.updateOne({ comments: deletedComment._id }, { $pull: { comments: deletedComment._id } })

    return deletedComment
  } catch(err) {
    throw err
  }
}

exports.updateComment = async function(params, reqBody) {
  try {
    const { slug } = params
    const { text } = reqBody

    const comment = await Comment.findById(slug).populate('author')
    comment.text = text
    await comment.save()

    return comment
  } catch(err) {
    throw err
  }
}

exports.replyToComment = async function(user, params, reqBody) {
  try {
    const { slug } = params 
    const { text } = reqBody

    const parentComment = await Comment.findById(slug)
    if (!parentComment) {
      throw new Error('Parent comment not found!')
    }

    const newComment = new Comment({
      author: user._id,
      text,
      parentComment: parentComment._id
    })

    await newComment.save()
    await parentComment.updateRepliesCount()

    const populatedComment = await newComment.populate('author')

    return populatedComment
  } catch(err) {
    throw err
  }
}

exports.getCommentReplies = async function(params) {
  try {
    const { slug } = params
    
    const replies = await Comment.find({ parentComment: slug }).populate('author')
    
    return replies
  } catch(err) {
    throw err
  }
}