import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { RequestHandler } from 'express-serve-static-core'
import fs from 'fs'
import path from 'path'
import { Comment } from '../models/Comment'
import { Post, validateCreatePost, validateUpdatePost } from '../models/Post'
import {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} from '../utils/cloudinary'

/**
 * @description Create New Post
 * @route POST /api/posts
 * @access Private
 */

export const createPostCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    /**
     * 1. validate for image
     * 2. validate for data
     * 3. upload photo
     * 4. create new post and save it to DB
     * 5. send response
     * 6. delete image from the server
     */
    // 1. validate for image
    if (!req.file) {
      return res.status(400).json({
        message: 'no image provided',
      })
    }
    // 2. validate for data
    const { error } = validateCreatePost(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      })
    }
    // 3. upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result: any = await cloudinaryUploadImage(imagePath)
    // 4. create new post and save it to DB
    const post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      // @ts-ignore
      user: req.user.id,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    })
    // 5. send response
    res.status(201).json({
      message: 'post created',
      post,
    })
    // 6. delete image from the server
    fs.unlinkSync(imagePath)
  }
)

/**
 * @description Get All Posts
 * @route GET /api/posts
 * @access Pulic
 */
export const getAllPostCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { pageNo, category } = req.query
    const pageSize = 3
    let posts = {}
    if (pageNo) {
      posts = await Post.find()
        .skip((Number(pageNo) - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate('user', ['-password'])
    } else if (category) {
      posts = await Post.find({ category: category })
        .sort({ createdAt: -1 })
        .populate('user', ['-password'])
    } else {
      posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('user', ['-password'])
    }
    res.status(200).json(posts)
  }
)

/**
 * @description Get Single Post
 * @route GET /api/posts/:id
 * @access Pulic
 */

export const getSinglePostCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const post = await Post.findById(req.params.id)
      .populate('user', ['-password'])
      .populate('comments')
    if (!post) {
      return res.status(404).json({
        message: 'post not found',
      })
    }
    res.status(200).json(post)
  }
)

/**
 * @description Get Post Cound
 * @route GET /api/posts/count
 * @access Pulic
 */

export const getPostCountCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const count = await Post.countDocuments()
    res.status(200).json(count)
  }
)

/**
 * @description Delete Post
 * @route DELETE /api/posts/:id
 * @access Private
 */

export const deletePostCtrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        message: 'post not found',
      })
    }
    // @ts-ignore
    if (req.user.isAdmin || post.user.toString() === req.user.id) {
      await Post.findByIdAndDelete(req.params.id)
      await cloudinaryRemoveImage(post.image.publicId)

      // delete all comments related to this post
      await Comment.deleteMany({ postId: post._id })

      return res.status(200).json({
        message: 'post deleted',
        postID: post._id,
      })
    } else {
      return res.status(401).json({
        message: 'unauthorized',
      })
    }
  }
)

/**
 * @description Update Post
 * @route PUT /api/posts/:id
 * @access Private
 */

export const updatePostCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // 1.Validateion
    const { error } = validateUpdatePost(req.body)
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      })
    }
    // 2. Find the post from the DB
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        message: 'post not found',
      })
    }
    // 3. Check if the user own this post
    // @ts-ignore
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'access denied',
      })
    }
    // 4. Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
        },
      },
      { new: true }
    ).populate('user', ['-password'])
    // 5. Send response
    res.status(200).json(updatedPost)
  }
)
/**
 * @description Update Post Image
 * @route PUT /api/posts/upload-image/:id
 * @access Private
 */

export const updatePostImageCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // 1.Validateion
    if (!req.file) {
      return res.status(400).json({
        message: 'no image provided',
      })
    }

    // 2. Find the post from the DB
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        message: 'post not found',
      })
    }
    // 3. Check if the user own this post
    // @ts-ignore
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'access denied',
      })
    }
    // 4. delete post image
    await cloudinaryRemoveImage(post.image.publicId)

    // 5. upload new image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result: any = await cloudinaryUploadImage(imagePath)

    // 6. Update the post in DB
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        },
      },
      { new: true }
    )

    // 7. Send response
    res.status(200).json(updatedPost)

    // 8. delete image from the server
    fs.unlinkSync(imagePath)
  }
)

/**
 * @description Toggle Like Post
 * @route PUT /api/posts/like/:id
 * @access Private
 */
export const toggleLikePostCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    // 1. Get the post from DB
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        message: 'post not found',
      })
    }
    // 2. Check if the user already liked this post
    // @ts-ignore
    const isLiked = post.likes.includes(req.user.id)
    if (isLiked) {
      // 3. If yes, unlike it
      // @ts-ignore
      await post.updateOne({ $pull: { likes: req.user.id } })
      res.status(200).json({
        message: 'post unliked',
      })
    } else {
      // 4. If no, like it
      // @ts-ignore
      await post.updateOne({ $push: { likes: req.user.id } })
      res.status(200).json({
        message: 'post liked',
      })
    }
  }
)
