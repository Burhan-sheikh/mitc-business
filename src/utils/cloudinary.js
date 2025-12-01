import imageCompression from 'browser-image-compression'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Compress image before upload
export const compressImage = async (file, maxSizeMB = 0.7) => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8
  }

  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.error('Error compressing image:', error)
    return file // Return original if compression fails
  }
}

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, folder = 'mitc-products') => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration missing')
  }

  try {
    // Compress image first
    const compressedFile = await compressImage(file)

    const formData = new FormData()
    formData.append('file', compressedFile)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', folder)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'mitc-products') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder))
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw error
  }
}

// Get optimized image URL
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary')) return url

  const {
    width = 800,
    quality = 'auto',
    format = 'auto'
  } = options

  // Insert transformation parameters into Cloudinary URL
  const parts = url.split('/upload/')
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_${width},q_${quality},f_${format}/${parts[1]}`
  }

  return url
}

// Get thumbnail URL
export const getThumbnailUrl = (url, size = 300) => {
  return getOptimizedImageUrl(url, { width: size, quality: 'auto', format: 'auto' })
}