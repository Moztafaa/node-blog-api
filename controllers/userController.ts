import bcrypt from 'bcryptjs'
import { Request, RequestHandler, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { User, validateUpdateUser } from '../models/User.ts'

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
  },
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
  },
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
      { new: true },
    )
    res.status(200).json(updatedUser)
  },
)
/**
 * @description Get Users Count
 * @route GET /api/users
 * @access Private
 */
export const getUsersCount: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // @ts-ignore
    const count = await User.count()
    res.status(200).json(count)
  },
)
/**
 * @description Upload User Profile Photo
 * @route PUT /api/users/profile/profile-photo-upload
 * @access Private
 */

export const profilePhotoUploadCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    if (!req.file) {
      return res.status(400).json({
        message: 'Please upload a file',
      })
    }
    res.status(200).json({ message: 'profile photo uploaded' })
  },
)
