import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export default async () => {
	try {
		// @ts-ignore
		await mongoose.connect(process.env.MONGO_URI)
		console.log('Connected to MongoDB ^_^')
	} catch (e) {
		console.log('Connection failed to MongoDB', e)
	}
}
