import Router from 'express'
import {
  getAllUserCtrl,
  getUserProfileCtrl,
  getUsersCount,
  profilePhotoUploadCtrl,
  updateUserProfileCtrl,
} from '../controllers/userController.ts'
import { photoUpload } from '../middleware/photoUpload.ts'
import validateObjectId from '../middleware/validateObjectId.ts'
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} from '../middleware/verifyToken.ts'

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

// /api/users/profile/profile-photo-upload
router.post(
  '/profile/profile-photo-upload',
  verifyToken,
  photoUpload.single('image'),
  profilePhotoUploadCtrl,
)

// /api/users/count
router.get('/count', verifyTokenAndAdmin, getUsersCount)

export { router as userRouter }
