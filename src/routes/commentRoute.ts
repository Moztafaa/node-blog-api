import { Router } from 'express'
import {
  createCommentCtrl,
  deleteCommentCtrl,
  getAllCommentsCtrl,
  updateCommentCtrl,
} from '../controllers/commentController'
import validateObjectId from '../middleware/validateObjectId'
import { verifyToken, verifyTokenAndAdmin } from '../middleware/verifyToken'

export const router = Router()
// /api/comments
router.post('/', verifyToken, createCommentCtrl)
router.get('/', verifyTokenAndAdmin, getAllCommentsCtrl)

// /api/comments/:id
router.delete('/:id', validateObjectId, verifyToken, deleteCommentCtrl)
router.put('/:id', validateObjectId, verifyToken, updateCommentCtrl)
