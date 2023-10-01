import { Router } from 'express'
import {
  createPostCtrl,
  deletePostCtrl,
  getAllPostCtrl,
  getPostCountCtrl,
  getSinglePostCtrl,
  updatePostCtrl,
  updatePostImageCtrl,
} from '../controllers/postsController'
import { photoUpload } from '../middleware/photoUpload'
import validateObjectId from '../middleware/validateObjectId'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()

// /api/posts
router.post('/', verifyToken, photoUpload.single('image'), createPostCtrl)
router.get('/', getAllPostCtrl)
router.get('/count', getPostCountCtrl)
// /api/posts/:id
router.get('/:id', validateObjectId, getSinglePostCtrl)
router.delete('/:id', validateObjectId, verifyToken, deletePostCtrl)
router.put('/:id', validateObjectId, verifyToken, updatePostCtrl)

// /api/posts/update-image/:id
router.put(
  '/update-image/:id',
  validateObjectId,
  verifyToken,
  photoUpload.single('image'),
  updatePostImageCtrl
)
export { router as postRouter }
