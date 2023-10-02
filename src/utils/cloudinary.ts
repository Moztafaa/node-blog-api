import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()
// @ts-ignore
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARIY_CLOUD_NAME,
  api_key: process.env.CLOUDINARIY_API_KEY,
  api_secret: process.env.CLOUDINARIY_API_SECRET,
})

// Upload the image to the cloudinary
export const cloudinaryUploadImage = async (fileToUpload: string) => {
  try {
    const data = await cloudinary.v2.uploader.upload(fileToUpload, {
      resource_type: 'auto',
    })
    return data
  } catch (error) {
    return error
  }
}

/**
 * Delete the image from the local storage
 * @param imagePublicId The public ID of the image to be deleted
 * @returns Promise<void> Resolves when the image is successfully deleted, or rejects with an error message
 */
export const cloudinaryRemoveImage = async (
  imagePublicId: string
): Promise<void> => {
  try {
    return await cloudinary.v2.uploader.destroy(imagePublicId)
  } catch (error) {
    throw error
  }
}
export const cloudinaryRemoveMultipleImage = async (
  publicIds: string[]
): Promise<void> => {
  try {
    return await cloudinary.v2.api.delete_resources(publicIds)
  } catch (error) {
    throw error
  }
}
