import Joi from 'joi'
import mongoose from 'mongoose'

// Comment Schema
const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Comment = mongoose.model('Comment', CommentSchema)

// Validate Create Comment
export function validateCreateComment(obj: {
  postId?: string
  text?: string
}): Joi.ValidationResult {
  const schema = Joi.object({
    postId: Joi.string().required().label('Post ID'),
    text: Joi.string().trim().required(),
  })
  return schema.validate(obj)
}

// Validate Update Comment
export function validateUpdateComment(obj: {
  text?: string
}): Joi.ValidationResult {
  const schema = Joi.object({
    text: Joi.string().trim(),
  })
  return schema.validate(obj)
}
