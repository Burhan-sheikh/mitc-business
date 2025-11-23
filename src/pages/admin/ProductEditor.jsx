import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, createProduct, updateProduct } from '../../services/productService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import ImageUploader from '../../components/admin/ImageUploader'

const ProductEditor = () => {
  const { id } = useParams()    // id === 'new' for new product
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState({
    title: '',
    price: '',
    brand: '',
    category: '',
    description: '',
    images: [],
    inStock: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isNew) {
      (async () => {
        const product = await getProduct(id)
        setForm(product)
      })()
    }
  }, [id, isNew])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (file) => {
    // ... integrate Cloudinary here (mock in UI for now)
    const url = URL.createObjectURL(file)
    setForm((f) => ({ ...f, images: [...f.images, url] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (isNew) {
      await createProduct(form)
    } else {
      await updateProduct(id, form)
    }
    setLoading(false)
    navigate('/admin/products')
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="input w-full" required />
        </div>
        <div>
          <label className="label">Brand</label>
          <input type="text" name="brand" value={form.brand} onChange={handleChange} className="input w-full" required />
        </div>
        <div>
          <label className="label">Category</label>
          <input type="text" name="category" value={form.category} onChange={handleChange} className="input w-full" required />
        </div>
        <div>
          <label className="label">Price</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="input w-full" required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="textarea w-full"></textarea>
        </div>
        <div>
          <label className="label">Images</label>
          <ImageUploader onUpload={handleImageUpload} />
          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images?.map((img, idx) => (
              <img key={idx} src={img} alt="product" className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} />
          <label className="label">In Stock</label>
        </div>
        <div className="flex gap-4 mt-6">
          <Button type="submit" loading={loading}>{isNew ? 'Create' : 'Save'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}
export default ProductEditor
