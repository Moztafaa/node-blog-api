import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization
  if (authToken) {
    const token = authToken.split(' ')[1]
    try {
      // @ts-ignore
      // decoded payload
      req.user = jwt.verify(token, process.env.JWT_SECRET)
      next()
    } catch (err) {
      res.status(401).json({ message: 'invalid Token, unauthorized' })
    }
  } else {
    res.status(401).json({ message: 'no token provided, unauthorized' })
  }
}

// verify token and admin
export const verifyTokenAndAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  verifyToken(req, res, () => {
    // @ts-ignore
    if (req.user.isAdmin) {
      next()
    } else {
      res
        .status(403)
        .json({ message: 'you are not authorized to perform this action' })
    }
  })
}

// verify token and Only user himself
export const verifyTokenAndOnlyUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  verifyToken(req, res, () => {
    // @ts-ignore
    if (req.params.id === req.user.id) {
      next()
    } else {
      res
        .status(403)
        .json({ message: 'you are not authorized to perform this action' })
    }
  })
}

// verify token and Authorization
export const verifyTokenAndAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  verifyToken(req, res, () => {
    // @ts-ignore
    if (req.params.id === req.user.id || req.user.isAdmin) {
      next()
    } else {
      res
        .status(403)
        .json({ message: 'you are not authorized to perform this action' })
    }
  })
}
