import Router from 'express'
import {
  deleteUserProfileCtrl,
  getAllUserCtrl,
  getUserProfileCtrl,
  getUsersCount,
  profilePhotoUploadCtrl,
  updateUserProfileCtrl,
} from '../controllers/userController'
import { photoUpload } from '../middleware/photoUpload'
import validateObjectId from '../middleware/validateObjectId'
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  verifyTokenAndOnlyUser,
} from '../middleware/verifyToken'

const router = Router()

// /api/users/profile
router.get('/profile', verifyTokenAndAdmin, getAllUserCtrl)

// /api/users/profile/:id
router.get('/profile/:id', validateObjectId, getUserProfileCtrl)
router.put(
  '/profile/:id',
  validateObjectId,
  verifyTokenAndOnlyUser,
  updateUserProfileCtrl
)
router.delete(
  '/profile/:id',
  validateObjectId,
  verifyTokenAndAuthorization,
  deleteUserProfileCtrl
)

// /api/users/profile/profile-photo-upload
router.post(
  '/profile/profile-photo-upload',
  verifyToken,
  photoUpload.single('image'),
  profilePhotoUploadCtrl
)

// /api/users/count
router.get('/count', verifyTokenAndAdmin, getUsersCount)

export { router as userRouter }
