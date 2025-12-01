// Product limits as per specification
export const PRODUCT_LIMITS = {
  TOTAL: 80,
  TOP_HIGHLIGHT: 10,
  DEALS: 10,
  NEW_ARRIVALS: 10,
  LIMITED_STOCK: 10,
  CATEGORY_GRID: 30,
  BOTTOM_HIGHLIGHT: 10,
  RELATED_PRODUCTS: 8
}

// Product categories
export const PRODUCT_CATEGORIES = {
  PREMIUM: 'Premium',
  STANDARD: 'Standard',
  BASIC: 'Basic',
  NEW: 'New',
  LIMITED: 'Limited',
  DEAL: 'Deal',
  HIGHLIGHT_TOP: 'HighlightTop',
  HIGHLIGHT_BOTTOM: 'HighlightBottom'
}

// Product conditions
export const PRODUCT_CONDITIONS = [
  'New',
  'Like New',
  'Used',
  'Refurbished'
]

// Customer warranty period (days)
export const WARRANTY_PERIOD_DAYS = 15

// Customer statuses
export const CUSTOMER_STATUS = {
  ACTIVE: 'Active',
  WARRANTY_EXPIRED: 'Warranty Expired',
  REVIEW_REQUESTED: 'Review Requested',
  COMPLETED: 'Completed'
}

// Review statuses
export const REVIEW_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
}

// Common laptop brands
export const LAPTOP_BRANDS = [
  'HP',
  'Dell',
  'Lenovo',
  'Asus',
  'Acer',
  'Apple',
  'MSI',
  'Samsung',
  'Toshiba',
  'Microsoft'
]

// Common RAM options
export const RAM_OPTIONS = [
  '4GB',
  '8GB',
  '16GB',
  '32GB',
  '64GB'
]

// Common storage options
export const STORAGE_OPTIONS = [
  '128GB SSD',
  '256GB SSD',
  '512GB SSD',
  '1TB SSD',
  '2TB SSD',
  '500GB HDD',
  '1TB HDD'
]

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under ₹20,000', min: 0, max: 20000 },
  { label: '₹20,000 - ₹40,000', min: 20000, max: 40000 },
  { label: '₹40,000 - ₹60,000', min: 40000, max: 60000 },
  { label: '₹60,000 - ₹80,000', min: 60000, max: 80000 },
  { label: 'Above ₹80,000', min: 80000, max: Infinity }
]