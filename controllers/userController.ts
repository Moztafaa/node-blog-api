import bcrypt from 'bcryptjs'
import { Request, RequestHandler, Response } from 'express'
import asyncHandler from 'express-async-handler'
import fs from 'fs'
import path from 'path'
import { User, validateUpdateUser } from '../models/User.ts'
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from '../utils/cloudinary.ts'
/**
 * @description Get all users
 * @route GET /api/users
 * @access Private
 */
export const getAllUserCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const users = await User.find().select('-password')
    res.status(200).json(users)
  }
)
/**
 * @description Get user profile
 * @route GET /api/users/:id
 * @access Public
 */
export const getUserProfileCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  }
)
/**
 * @description Update user profile
 * @route PUT /api/users/:id
 * @access Private
 */
export const updateUserProfileCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { error } = validateUpdateUser(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          bio: req.body.bio,
        },
      },
      { new: true }
    )
    res.status(200).json(updatedUser)
  }
)
/**
 * @description Get Users Count
 * @route GET /api/users
 * @access Private
 */
export const getUsersCount: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const count = await User.countDocuments()
    res.status(200).json(count)
  }
)

/**
 * @description Upload User Profile Photo
 * @route PUT /api/users/profile/profile-photo-upload
 * @access Private
 */
export const profilePhotoUploadCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // 1. validatation
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a file',
      })
    }
    // 2. Get the path of the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)

    // 3. Upload to cloudinary
    const result: any = await cloudinaryUploadImage(imagePath)

    // 4. Get the user from DB
    // @ts-ignore
    const user = await User.findById(req.user.id)

    // 5. Update the user with the image path
    if (user?.profilePhoto.publicId !== null) {
      await cloudinaryRemoveImage(user?.profilePhoto.publicId)
    }
    // 6. change the profile photo field in the DB
    // @ts-ignore
    user?.profilePhoto = {
      url: result.secure_url,
      publicId: result.public_id,
    }
    await user?.save()
    // 7. Send the response
    res.status(200).json({
      message: 'profile photo uploaded',
      profilePhoto: { url: result.secure_url, publicId: result.public_id },
    })
    // 8. Remove image from the server
    fs.unlinkSync(imagePath)
  }
)

/**
 * @description Delete User Profile
 * @route DELETE /api/users/profile/:id
 * @access Private
 */

export const deleteUserProfileCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // 1. Get the user from DB
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // 2. @TODO - Get all posts from DB
    // 3. @TODO - Get the public ids from the posts
    // 4. @TODO - Delete all posts image from the cloudinary belongs to the user

    // 5. Delete the profile photo from cloudinary
    if (user.profilePhoto.public_Id !== null) {
      await cloudinaryRemoveImage(user?.profilePhoto.publicId)
    }
    // 6. @TODO - Delete user posts & comments from DB

    // 7. Delete user from DB
    // @ts-ignore
    await User.findByIdAndDelete(req.params.id)

    // 8. Send the response
    res.status(200).json({ message: 'User deleted' })
  }
)
