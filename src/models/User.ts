import Joi from 'joi'
import passwordComplexity from 'joi-password-complexity'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
        publicId: null,
      },
    },
    bio: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
// Populate posts when user is fetched
UserSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user',
  localField: '_id',
})

// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    // @ts-ignore
    process.env.JWT_SECRET
  )
}
export const User = mongoose.model('User', UserSchema)
//Validate Register User
export function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: passwordComplexity().required(),
  })
  return schema.validate(obj)
}

//Validate Login User
export function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: passwordComplexity().required(),
  })
  return schema.validate(obj)
}

//Validate Update User
export function validateUpdateUser(obj) {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(100),
    password: passwordComplexity(),
    bio: Joi.string().trim().min(5).max(100),
  })
  return schema.validate(obj)
}
