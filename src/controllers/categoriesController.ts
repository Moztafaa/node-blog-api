import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Category, validateCreateCategory } from '../models/Category'

/**
 * @description Create New Category
 * @route POST /api/categories
 * @access Private
 */

export const createCategoryCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { error } = validateCreateCategory(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    const category = await Category.create({
      ...req.body,
      // @ts-ignore
      user: req.user.id,
    })
    res.status(201).json(category)
  }
)

/**
 * @description Get all categories
 * @route GET /api/categories
 * @access Public
 */

export const getAllCategoriesCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const categories = await Category.find()
    res.status(200).json(categories)
  }
)

/**
 * @description Delete Category
 * @route DELETE /api/categories/:id
 * @access Private
 */

export const deleteCategoryCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    await Category.findByIdAndDelete(req.params.id)
    res
      .status(200)
      .json({ message: 'Category removed', categoryId: category._id })
  }
)
