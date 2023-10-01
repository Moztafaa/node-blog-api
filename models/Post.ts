import Joi from 'joi'
import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: '',
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const Post = mongoose.model('Post', PostSchema)

// Validate Create Post
export function validateCreatePost(obj: {
  title?: string
  description?: string
  category?: string
}): Joi.ValidationResult {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().min(10).required(),
    category: Joi.string().trim().required(),
  })
  return schema.validate(obj)
}

// Validate Update Post
export function validateUpdatePost(obj: {
  title?: string
  description?: string
  category?: string
}): Joi.ValidationResult {
  const schema = Joi.object({
    title: Joi.string().trim().min(2).max(200),
    description: Joi.string().trim().min(10),
    category: Joi.string().trim(),
  })
  return schema.validate(obj)
}
