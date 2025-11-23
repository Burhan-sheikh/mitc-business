import React, { useEffect, useState } from 'react'
import ProductTable from '../../components/admin/ProductTable'
import Button from '../../components/common/Button'
import { getProducts, deleteProduct } from '../../services/productService'
import { useNavigate } from 'react-router-dom'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const data = await getProducts()
      setProducts(data.products || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const handleEdit = (product) => {
    navigate(`/admin/products/${product.id}`)
  }
  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <Button onClick={() => navigate('/admin/products/new')}>Add Product</Button>
      </div>
      <ProductTable products={products} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
export default ProductManagement
