import { Router } from 'express'
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getAllCategoriesCtrl,
} from '../controllers/categoriesController'
import { verifyTokenAndAdmin } from '../middleware/verifyToken'

export const router = Router()

// /api/categories
router.post('/', verifyTokenAndAdmin, createCategoryCtrl)
router.get('/', getAllCategoriesCtrl)

// /api/categories/:id
router.delete('/:id', verifyTokenAndAdmin, deleteCategoryCtrl)
