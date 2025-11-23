// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format date
export const formatDate = (date, format = 'short') => {
  if (!date) return ''
  
  const d = date.toDate ? date.toDate() : new Date(date)
  
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  }
  
  if (format === 'long') {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  }
  
  return d.toLocaleDateString('en-IN')
}

// Format relative time
export const formatRelativeTime = (date) => {
  const d = date.toDate ? date.toDate() : new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now - d) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }

  return formatDate(date, 'short')
}

// Truncate text
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Calculate average rating
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.length).toFixed(1)
}

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
