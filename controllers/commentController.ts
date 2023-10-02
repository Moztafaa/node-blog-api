import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} from '../models/Comment'
import { User } from '../models/User'

/**
 * @description Create New Comment
 * @route POST /api/comments
 * @access Private
 */

export const createCommentCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { error } = validateCreateComment(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    // @ts-ignore
    const profile = await User.findById(req.user.id)
    const comment = await Comment.create({
      ...req.body,
      // @ts-ignore
      user: req.user.id,
      username: profile?.username,
    })
    res.status(201).json(comment)
  }
)

/**
 * @description Get all comments
 * @route GET /api/comments
 * @access Public
 */

export const getAllCommentsCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const comments = await Comment.find().populate('user')
    res.status(200).json(comments)
  }
)

/**
 * @description Delete Comment
 * @route DELETE /api/comments/:id
 * @access Private
 */

export const deleteCommentCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    // @ts-ignore
    if (req.user.isAdmin || req.user.id === comment.user.toString()) {
      await Comment.findByIdAndDelete(req.params.id)
      res
        .status(200)
        .json({ message: 'Comment removed', commentId: comment._id })
    } else {
      res.status(403).json({ message: 'Access denied, not allowed' })
    }
  }
)

/**
 * @description Update Comment
 * @route PUT /api/comments/:id
 * @access Private
 */

export const updateCommentCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { error } = validateUpdateComment(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const comment = await Comment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    // @ts-ignore
    if (req.user.id === comment.user.toString()) {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            text: req.body.text,
          },
        },
        { new: true }
      )
      res.status(200).json(updatedComment)
    } else {
      res.status(403).json({
        message:
          'Access denied, not allowed: only the owner of the user can edit the post',
      })
    }
  }
)
