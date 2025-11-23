import imageCompression from 'browser-image-compression'

// Compress image before upload
export const compressImage = async (file, maxSizeMB = 0.7) => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  }

  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.error('Image compression error:', error)
    throw error
  }
}

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.')
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 10MB.')
  }

  return true
}

// Generate thumbnail
export const generateThumbnail = async (file, maxWidth = 300) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        const scale = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scale
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/jpeg', 0.8)
      }
      
      img.onerror = reject
    }
    
    reader.onerror = reject
  })
}
