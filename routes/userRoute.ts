import Router from 'express'
import {getAllUserCtrl} from '../controllers/userController.ts'

const router = Router()

// /api/users/profile
router.get('/profile', getAllUserCtrl)

export {
	router as userRouter
}