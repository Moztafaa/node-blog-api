import Router from 'express'
import {
  getAllUserCtrl,
  getUserProfileCtrl,
  getUsersCount,
  updateUserProfileCtrl,
} from '../controllers/userController.ts'
import {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} from '../middleware/verifyToken.ts'
import validateObjectId from '../middleware/validateObjectId.ts'

const router = Router()

// /api/users/profile
router.get('/profile', verifyTokenAndAdmin, getAllUserCtrl)

// /api/users/profile/:id
router.get('/profile/:id', validateObjectId, getUserProfileCtrl)
router.put(
  '/profile/:id',
  validateObjectId,
  verifyTokenAndOnlyUser,
  updateUserProfileCtrl,
)

// /api/users/count
router.get('/count', verifyTokenAndAdmin, getUsersCount)

export { router as userRouter }
