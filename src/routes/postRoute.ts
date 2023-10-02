import { Router } from 'express'
import {
  createPostCtrl,
  deletePostCtrl,
  getAllPostCtrl,
  getPostCountCtrl,
  getSinglePostCtrl,
  toggleLikePostCtrl,
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

// /api/posts/like/:id
router.put('/like/:id', validateObjectId, verifyToken, toggleLikePostCtrl)
export { router as postRouter }
