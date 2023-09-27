import asyncHandler from 'express-async-handler'
import {User} from '../models/User.ts'

/**
 * @description Get all users
 * @route GET /api/users
 * @access Private
 */
export const getAllUserCtrl = asyncHandler(
	async (req, res) => {
		const users = await User.find().select('-password')
		res.status(200).json(users)
	}
)