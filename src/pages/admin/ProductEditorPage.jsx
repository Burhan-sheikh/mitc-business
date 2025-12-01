import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, createProduct, updateProduct } from '../../services/productService'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { generateSlug } from '../../utils/helpers'
import { LAPTOP_BRANDS, PRODUCT_CONDITIONS, RAM_OPTIONS, STORAGE_OPTIONS } from '../../utils/constants'
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ProductEditorPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(productId)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    brand: '',
    model: '',
    shortSlogan: '',
    description: '',
    price: '',
    condition: 'Used',
    ram: '',
    cpu: '',
    gpu: '',
    storage: '',
    color: '',
    stockCount: '',
    isLimitedStock: false,
    isNewArrival: false,
    isDeal: false,
    isTopHighlight: false,
    isBottomHighlight: false,
    category: [],
    tags: [],
    featuredImage: '',
    galleryImages: [],
    published: false
  })
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (isEditing) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await getProduct(productId)
      setFormData({
        ...data,
        category: data.category || [],
        tags: data.tags || [],
        galleryImages: data.galleryImages || []
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
      navigate('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  const handleCategoryChange = (category) => {
    setFormData(prev => {
      const categories = prev.category || []
      if (categories.includes(category)) {
        return { ...prev, category: categories.filter(c => c !== category) }
      } else {
        return { ...prev, category: [...categories, category] }
      }
    })
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleImageUpload = async (e, isGallery = false) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file, 'mitc-products'))
      const results = await Promise.all(uploadPromises)
      const urls = results.map(r => r.url)

      if (isGallery) {
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...urls]
        }))
      } else {
        setFormData(prev => ({ ...prev, featuredImage: urls[0] }))
      }
      
      toast.success('Image(s) uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stockCount: Number(formData.stockCount)
      }

      if (isEditing) {
        await updateProduct(productId, productData)
        toast.success('Product updated successfully')
      } else {
        await createProduct(productData)
        toast.success('Product created successfully')
      }
      
      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <FiArrowLeft />
          Back to Products
        </button>
        <h1 className="text-3xl font-bold text-slate-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Basic Info */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand *</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="input"
                >
                  <option value="">Select Brand</option>
                  {LAPTOP_BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Short Slogan</label>
              <input
                type="text"
                name="shortSlogan"
                value={formData.shortSlogan}
                onChange={handleChange}
                placeholder="Brief product highlight"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pricing & Stock</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="input"
              >
                {PRODUCT_CONDITIONS.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Count *</label>
              <input
                type="number"
                name="stockCount"
                value={formData.stockCount}
                onChange={handleChange}
                required
                min="0"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">RAM</label>
              <select name="ram" value={formData.ram} onChange={handleChange} className="input">
                <option value="">Select RAM</option>
                {RAM_OPTIONS.map(ram => (
                  <option key={ram} value={ram}>{ram}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Storage</label>
              <select name="storage" value={formData.storage} onChange={handleChange} className="input">
                <option value="">Select Storage</option>
                {STORAGE_OPTIONS.map(storage => (
                  <option key={storage} value={storage}>{storage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Processor (CPU)</label>
              <input
                type="text"
                name="cpu"
                value={formData.cpu}
                onChange={handleChange}
                placeholder="e.g., Intel i5-1240P"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graphics (GPU)</label>
              <input
                type="text"
                name="gpu"
                value={formData.gpu}
                onChange={handleChange}
                placeholder="e.g., NVIDIA GTX 1650"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          
          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Featured Image *</label>
            {formData.featuredImage ? (
              <div className="relative inline-block">
                <img src={formData.featuredImage} alt="Featured" className="w-48 h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary-500">
                <FiUpload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-600">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Gallery Images</label>
            <div className="flex flex-wrap gap-4">
              {formData.galleryImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image} alt={`Gallery ${index + 1}`} className="w-32 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary-500">
                <FiUpload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs text-slate-600">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, true)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {uploading && <p className="text-sm text-slate-600 mt-2">Uploading...</p>}
        </div>

        {/* Categories & Flags */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Categories & Flags</h2>
          
          {/* Categories */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {['Premium', 'Standard', 'Basic'].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.category.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="rounded border-slate-300 text-primary-600"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                className="rounded border-slate-300 text-primary-600"
              />
              <span className="text-sm">New Arrival</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isDeal"
                checked={formData.isDeal}
                onChange={handleChange}
                className="rounded border-slate-300 text-primary-600"
              />
              <span className="text-sm">Deal</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isLimitedStock"
                checked={formData.isLimitedStock}
                onChange={handleChange}
                className="rounded border-slate-300 text-primary-600"
              />
              <span className="text-sm">Limited Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isTopHighlight"
                checked={formData.isTopHighlight}
                onChange={handleChange}
                className="rounded border-slate-300 text-primary-600"
              />
              <span className="text-sm">Top Highlight Bar</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isBottomHighlight"
                checked={formData.isBottomHighlight}
                onChange={handleChange}
                className="rounded border-slate-300 text-primary-600"
              />
              <span className="text-sm">Bottom Highlight Bar</span>
            </label>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag and press Enter"
                className="input flex-1"
              />
              <button type="button" onClick={handleAddTag} className="btn-secondary">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="badge bg-slate-200 text-slate-700 flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-600">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Publish */}
        <div className="card p-6 mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-5 h-5 rounded border-slate-300 text-primary-600"
            />
            <div>
              <div className="font-medium">Publish Product</div>
              <div className="text-sm text-slate-600">Make this product visible on the public site</div>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductEditorPage