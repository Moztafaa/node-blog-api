import mongoose from 'mongoose'
import Joi from 'joi'
import passwordComplexity from 'joi-password-complexity'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		minLength: 2,
		maxLength: 100
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 5,
		maxLength: 100,
		unique: true
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: 8
	},
	profilePhoto: {
		type: Object,
		default: {
			url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
			publicId: null
		}
	},
	bio: String,
	isAdmin: {
		type: Boolean,
		default: false
	},
	isAccountVerified: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
})

// Generate Auth Token
UserSchema.methods.generateAuthToken = function() {
	// @ts-ignore
	return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
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
