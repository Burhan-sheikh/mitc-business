// Validate product data
export const validateProduct = (productData) => {
  const errors = {}

  if (!productData.title || productData.title.trim().length === 0) {
    errors.title = 'Title is required'
  }

  if (!productData.price || productData.price < 0) {
    errors.price = 'Valid price is required'
  }

  if (!productData.category || productData.category.trim().length === 0) {
    errors.category = 'Category is required'
  }

  if (!productData.brand || productData.brand.trim().length === 0) {
    errors.brand = 'Brand is required'
  }

  if (!productData.images || productData.images.length === 0) {
    errors.images = 'At least one image is required'
  }

  if (productData.images && productData.images.length > 10) {
    errors.images = 'Maximum 10 images allowed'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate review data
export const validateReview = (reviewData) => {
  const errors = {}

  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5'
  }

  if (!reviewData.comment || reviewData.comment.trim().length < 10) {
    errors.comment = 'Comment must be at least 10 characters'
  }

  if (reviewData.comment && reviewData.comment.length > 1000) {
    errors.comment = 'Comment must be less than 1000 characters'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password
export const validatePassword = (password) => {
  const errors = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
