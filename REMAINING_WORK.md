# Completing the MITC Web App - Step by Step Guide

## What's Already Done ✅

All the "hard work" is complete:
- Firebase configuration
- Database services (products, customers, reviews)
- Authentication with role management
- Cloudinary image upload
- Layout components (headers, footers, sidebars)
- Routing setup
- PWA configuration
- Tailwind styling system

**You now need to create the page components that USE these services.**

---

## Quick Start Template

Every page follows this pattern:

```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../../services/productService' // or other service
import toast from 'react-hot-toast'

const YourPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const result = await getProducts({ published: true })
      setData(result)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container-custom section-padding">
      <h1 className="text-3xl font-bold mb-6">Your Page</h1>
      {/* Your content here */}
    </div>
  )
}

export default YourPage
```

---

## Pages to Create

### 1. HomePage (`src/pages/public/HomePage.jsx`)

**What it needs:**
- Call `getProducts()` with different filters for each section
- Top highlight: `{ isTopHighlight: true, published: true, limit: 10 }`
- Deals: `{ isDeal: true, published: true, limit: 10 }`
- New arrivals: `{ isNewArrival: true, published: true, limit: 10 }`
- Limited stock: `{ isLimitedStock: true, published: true, limit: 10 }`
- Categories: filter by `Premium`, `Standard`, `Basic`

**UI Structure:**
```jsx
<section className="top-highlights"> {/* Auto slider */}
<section className="deals-banner"> {/* Full-width slider */}
<section className="new-arrivals"> {/* 2-column grid */}
<section className="limited-stock"> {/* Horizontal row */}
<section className="categories"> {/* 2-column grid, 30 total */}
<section className="bottom-highlights"> {/* Auto slider */}
```

**Services to use:**
- `getProducts(filters)` from `productService.js`

---

### 2. ProductsPage (`src/pages/public/ProductsPage.jsx`)

**What it needs:**
- Search products from URL query: `?search=...`
- Filter panel: brand, category, price, condition, tags
- Grid or list view toggle
- Call `searchProducts(term)` or `getProducts(filters)`

**UI Structure:**
```jsx
<div className="flex gap-6">
  <aside className="w-64"> {/* Filters */}
  <main className="flex-1"> {/* Product grid */}
</div>
```

**Services to use:**
- `searchProducts(searchTerm)` from `productService.js`
- `getProducts(filters)` from `productService.js`

---

### 3. ProductDetailPage (`src/pages/public/ProductDetailPage.jsx`)

**What it needs:**
- Get product ID from URL: `useParams()`
- Call `getProduct(productId)`
- Call `getRelatedProducts(productId)`
- Image gallery with thumbnails
- Contact modal (WhatsApp, Instagram, etc.)
- Use message templates from `useSiteSettings()`

**UI Structure:**
```jsx
<div className="grid md:grid-cols-2 gap-8">
  <div> {/* Image gallery */}
  <div> {/* Product info + Contact button */}
</div>
<section> {/* Specifications table */}
<section> {/* Related products */}
```

**Services to use:**
- `getProduct(productId)` from `productService.js`
- `getRelatedProducts(productId)` from `productService.js`
- `useSiteSettings()` for contact templates

---

### 4-6. Static Pages (About/Terms/Privacy)

**What they need:**
- Load content from `useSiteSettings()`
- Display `settings.pages.about.content` (or terms/privacy)
- Display featured image if available

**UI Structure:**
```jsx
const { settings } = useSiteSettings()

return (
  <div className="container-custom section-padding">
    <h1>{settings.pages.about.title}</h1>
    {settings.pages.about.featuredImage && <img src={...} />}
    <div dangerouslySetInnerHTML={{ __html: settings.pages.about.content }} />
  </div>
)
```

---

### 7. ContactPage (`src/pages/public/ContactPage.jsx`)

**What it needs:**
- Display store info from `settings.branding`
- Display contact info from `settings.pages.contact`
- Embed Google Maps iframe from `settings.pages.contact.mapEmbedUrl`
- Social links

**UI Structure:**
```jsx
<div className="grid md:grid-cols-2 gap-8">
  <div> {/* Contact info */}
  <div> {/* Map embed */}
</div>
```

---

### 8. LoginPage (`src/pages/auth/LoginPage.jsx`)

**What it needs:**
- Email/password form
- Call `signIn(email, password)` from `useAuth()`
- Google sign-in button: call `signInWithGoogle()`
- Redirect to `/admin` if admin, `/` if user

**UI Structure:**
```jsx
const { signIn, signInWithGoogle } = useAuth()

<form onSubmit={handleSubmit}>
  <input type="email" />
  <input type="password" />
  <button type="submit">Sign In</button>
</form>
<button onClick={signInWithGoogle}>Sign in with Google</button>
```

---

### 9. AdminDashboard (`src/pages/admin/AdminDashboard.jsx`)

**What it needs:**
- Call `getProductsCountByCategory()` from `productService.js`
- Call `getCustomers()` to count active warranties
- Call `getReviews({ status: 'Pending' })` for review count
- Display in stat cards

**UI Structure:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <StatCard title="Total Products" value={counts.total} />
  <StatCard title="New Stock" value={counts.newArrivals} />
  <StatCard title="Limited Stock" value={counts.limitedStock} />
  <StatCard title="Pending Reviews" value={pendingReviews.length} />
</div>
```

---

### 10. CustomersPage (`src/pages/admin/CustomersPage.jsx`)

**What it needs:**
- Call `getCustomers()` from `customerService.js`
- Display in table with filters
- Add customer button → form modal
- Call `createCustomer(data)` to add
- Call `updateCustomerStatus(id, status)` to change status

**UI Structure:**
```jsx
<div>
  <button onClick={openAddModal}>Add Customer</button>
  <table>
    {customers.map(customer => (
      <tr key={customer.id}>
        <td>{customer.name}</td>
        <td>{customer.phone}</td>
        <td>{customer.warrantyEndDate}</td>
        <td>{customer.status}</td>
      </tr>
    ))}
  </table>
</div>
```

---

### 11. CustomerDetailPage (`src/pages/admin/CustomerDetailPage.jsx`)

**What it needs:**
- Get customer ID from URL
- Call `getCustomer(customerId)`
- Display customer info, product, warranty status
- Buttons for: "Send Warranty Reminder", "Send Review Request"

---

### 12. ProductsManagementPage (`src/pages/admin/ProductsManagementPage.jsx`)

**What it needs:**
- Call `getProducts()` (no published filter for admin)
- Display in table
- Actions: Edit (navigate to `/admin/products/:id/edit`)
- Duplicate: call `duplicateProduct(id)`
- Delete: call `deleteProduct(id)` with confirmation

**UI Structure:**
```jsx
<table>
  {products.map(product => (
    <tr key={product.id}>
      <td><img src={product.featuredImage} /></td>
      <td>{product.title}</td>
      <td>{product.brand}</td>
      <td>{product.price}</td>
      <td>
        <button onClick={() => navigate(`/admin/products/${product.id}/edit`)}>Edit</button>
        <button onClick={() => handleDuplicate(product.id)}>Duplicate</button>
        <button onClick={() => handleDelete(product.id)}>Delete</button>
      </td>
    </tr>
  ))}
</table>
```

---

### 13. ProductEditorPage (`src/pages/admin/ProductEditorPage.jsx`)

**What it needs:**
- Check if editing (ID in URL) or creating (no ID)
- If editing: call `getProduct(productId)` and pre-fill form
- Form with all fields from spec
- Image upload: call `uploadToCloudinary(file)`
- Submit: call `createProduct(data)` or `updateProduct(id, data)`

**Form Fields:**
```jsx
<form>
  <input name="title" />
  <select name="brand" />
  <input name="model" />
  <input name="price" type="number" />
  <select name="condition" />
  <input name="ram" />
  <input name="cpu" />
  <input name="storage" />
  <input name="stockCount" type="number" />
  <input type="file" multiple onChange={handleImageUpload} />
  <input type="checkbox" name="isNewArrival" />
  <input type="checkbox" name="isDeal" />
  <input type="checkbox" name="isLimitedStock" />
  <input type="checkbox" name="published" />
  <button type="submit">Save Product</button>
</form>
```

**Services to use:**
- `uploadToCloudinary(file)` from `cloudinary.js`
- `createProduct(data)` or `updateProduct(id, data)` from `productService.js`

---

### 14. StoreReviewsPage (`src/pages/admin/StoreReviewsPage.jsx`)

**What it needs:**
- Call `getReviews()` from `reviewService.js`
- Filter tabs: All, Pending, Approved, Rejected
- Approve button: call `approveReview(id)`
- Reject button: call `rejectReview(id)`
- Export buttons: call `downloadCSV(reviews)` or `downloadJSON(reviews)`

**UI Structure:**
```jsx
<div>
  <div className="tabs">
    <button onClick={() => setFilter('all')}>All</button>
    <button onClick={() => setFilter('pending')}>Pending</button>
    <button onClick={() => setFilter('approved')}>Approved</button>
  </div>
  
  <table>
    {reviews.map(review => (
      <tr key={review.id}>
        <td>{review.customerName}</td>
        <td>{review.rating} ⭐</td>
        <td>{review.comment}</td>
        <td>
          <button onClick={() => handleApprove(review.id)}>Approve</button>
          <button onClick={() => handleReject(review.id)}>Reject</button>
        </td>
      </tr>
    ))}
  </table>
  
  <button onClick={() => downloadCSV(reviews)}>Export CSV</button>
</div>
```

---

### 15. SiteSettingsPage (`src/pages/admin/SiteSettingsPage.jsx`)

**What it needs:**
- Load `settings` from `useSiteSettings()`
- Tabbed interface: Branding, Pages, Plugins
- **Branding tab**: logo upload, slogan, phone, social links
- **Pages tab**: edit About, Terms, Privacy, Contact content (use react-quill)
- **Plugins tab**: Cloudinary config (display only)
- Call `updateSettings(newSettings)` to save

**UI Structure:**
```jsx
const { settings, updateSettings } = useSiteSettings()
const [activeTab, setActiveTab] = useState('branding')

return (
  <div>
    <div className="tabs">
      <button onClick={() => setActiveTab('branding')}>Branding</button>
      <button onClick={() => setActiveTab('pages')}>Pages</button>
      <button onClick={() => setActiveTab('plugins')}>Plugins</button>
    </div>
    
    {activeTab === 'branding' && (
      <form onSubmit={handleSubmit}>
        <input name="logo" type="file" />
        <input name="slogan" defaultValue={settings.branding.slogan} />
        <input name="phone" defaultValue={settings.branding.phone} />
        <input name="whatsapp" defaultValue={settings.branding.social.whatsapp} />
        <button type="submit">Save</button>
      </form>
    )}
    
    {activeTab === 'pages' && (
      {/* Similar form for page content */}
    )}
  </div>
)
```

---

## Available Services & Functions

### Products
```javascript
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  duplicateProduct,
  searchProducts,
  getRelatedProducts 
} from '../services/productService'
```

### Customers
```javascript
import { 
  getCustomers, 
  getCustomer, 
  createCustomer, 
  updateCustomer,
  updateCustomerStatus 
} from '../services/customerService'
```

### Reviews
```javascript
import { 
  getReviews, 
  createReview, 
  approveReview, 
  rejectReview 
} from '../services/reviewService'
```

### Cloudinary
```javascript
import { uploadToCloudinary, uploadMultipleImages } from '../utils/cloudinary'
```

### Helpers
```javascript
import { 
  formatCurrency, 
  formatDate, 
  generateSlug, 
  truncateText,
  downloadCSV,
  downloadJSON 
} from '../utils/helpers'
```

---

## Testing Your Pages

1. **Start dev server**: `npm run dev`
2. **Create an account** at `/login`
3. **Make yourself admin** in Firebase Console
4. **Add some products** in Admin Panel
5. **Test public pages**

---

## Tips

- **Copy-paste patterns**: All pages follow similar patterns
- **Use existing styles**: Classes like `btn-primary`, `card`, `badge` are ready
- **Toast for feedback**: `toast.success()` and `toast.error()` for user feedback
- **Loading states**: Always show loading while fetching
- **Error handling**: Wrap async calls in try-catch

---

## Need Help?

All the infrastructure is working. You just need to create the UI pages that call the services. Start with HomePage and LoginPage - they're the most important.

**Good luck! 🚀**