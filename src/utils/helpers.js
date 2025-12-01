// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date
export const formatDate = (date, format = 'short') => {
  if (!date) return ''
  
  const d = date instanceof Date ? date : new Date(date)
  
  if (format === 'short') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  if (format === 'time') {
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return d.toLocaleDateString('en-IN')
}

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const d = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffInMs = now - d
  const diffInSecs = Math.floor(diffInMs / 1000)
  const diffInMins = Math.floor(diffInSecs / 60)
  const diffInHours = Math.floor(diffInMins / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInSecs < 60) return 'Just now'
  if (diffInMins < 60) return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  
  return formatDate(d, 'short')
}

// Generate slug from title
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Get stock status
export const getStockStatus = (stockCount, isLimitedStock = false) => {
  if (stockCount === 0) return { text: 'Out of Stock', color: 'text-red-600' }
  if (isLimitedStock || stockCount <= 3) return { text: 'Limited Stock', color: 'text-yellow-600' }
  return { text: 'In Stock', color: 'text-green-600' }
}

// Calculate days until date
export const daysUntil = (date) => {
  if (!date) return 0
  
  const d = date instanceof Date ? date : new Date(date)
  const now = new Date()
  const diffInMs = d - now
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
  
  return diffInDays
}

// Check if warranty is expiring soon
export const isWarrantyExpiringSoon = (warrantyEndDate, daysThreshold = 3) => {
  const days = daysUntil(warrantyEndDate)
  return days > 0 && days <= daysThreshold
}

// Check if warranty is expired
export const isWarrantyExpired = (warrantyEndDate) => {
  return daysUntil(warrantyEndDate) < 0
}

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone (Indian format)
export const isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/
  return re.test(phone.replace(/[\s-]/g, ''))
}

// Format phone number
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`
  }
  return phone
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

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

// Download as JSON
export const downloadJSON = (data, filename = 'data.json') => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Download as CSV
export const downloadCSV = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}