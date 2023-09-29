import multer from 'multer'
import path from 'path'

// Photo Storage
const photoStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../images'))
  },
  filename(req, file, callback) {
    if (file) {
      callback(null, new Date().toISOString() + file.originalname)
    } else {
      callback(null, '')
    }
  },
})

// Photo Upload Middleware
export const photoUpload = multer({
  storage: photoStorage,
  fileFilter(req, file, callback) {
    if (file.mimetype.startsWith('image')) {
      callback(null, true)
    } else {
      callback(new Error('Only images are allowed'))
    }
  },
  limits: { fileSize: 1024 * 1024 },
})
