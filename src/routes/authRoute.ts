import express from 'express'

import {loginUserCtrl, registerUserCtrl} from '../controllers/authController'

const router = express.Router()
// /api/auth/register
router.post('/register', registerUserCtrl)

// /api/auth/login
router.post('/login', loginUserCtrl)

export {
	router as authRouter
}
