import Joi from 'joi'
import mongoose from 'mongoose'

// Category Schema
const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Category = mongoose.model('Category', CategorySchema)

// Validate Create Category
export function validateCreateCategory(obj: {
  title?: string
}): Joi.ValidationResult {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
  })
  return schema.validate(obj)
}
