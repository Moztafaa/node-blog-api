import asyncHandler from 'express-async-handler'
import {User, validateLoginUser, validateRegisterUser} from '../models/User'
import bcrypt from 'bcryptjs'
// import passwordComplexity from 'joi-password-complexity'
import {Request, Response} from 'express'
/**
 * @description Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUserCtrl = asyncHandler(async (req: Request, res: Response) :Promise<any>=> {
	const {error} = validateRegisterUser(req.body)
	if (error) {
		return res.status(400).json({message: error.details[0].message})
	}
	let user = await User.findOne({ email: req.body.email });
	if (user) {
		return res.status(400).json({ message: "user already exist" });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	user = new User({
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword,
	});
	await user.save();

		// TODO verify account

		//send response to client
		res.status(201).json({
			message: 'you registered successfully, please login'
		})

}
)

/**
 * @description Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUserCtrl = asyncHandler(
	async (req, res):Promise<any> => {
		//validate user input
		const {error} = validateLoginUser(req.body)
		if (error) {
			return res.status(400).json({message: error.details[0].message})
		}

		//check if user exist
		let user = await User.findOne({email: req.body.email})
		if (!user) {
			return res.status(400).json({message: 'invalid email or password'})
		}

		//check if password is correct
		const validPassword = await bcrypt.compare(req.body.password, user.password)
		if (!validPassword) {
			return res.status(400).json({message: 'invalid email or password'})
		}
		//generate token
		// @ts-ignore
		const token = user.generateAuthToken()

		// TODO verify account

		//send response to client
		res.status(200).json({
			_id: user._id,
			idAdmin: user.isAdmin,
			profilePhoto: user.profilePhoto,
			token,
		})
	}
)
