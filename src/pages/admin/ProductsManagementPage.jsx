import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts, deleteProduct, duplicateProduct } from '../../services/productService'
import { formatCurrency } from '../../utils/helpers'
import { FiEdit2, FiCopy, FiTrash2, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ProductsManagementPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [publishedFilter, setPublishedFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, brandFilter, publishedFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts({})
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.model?.toLowerCase().includes(term)
      )
    }

    if (brandFilter !== 'all') {
      filtered = filtered.filter(p => p.brand === brandFilter)
    }

    if (publishedFilter !== 'all') {
      filtered = filtered.filter(p => p.published === (publishedFilter === 'published'))
    }

    setFilteredProducts(filtered)
  }

  const handleDuplicate = async (productId) => {
    try {
      await duplicateProduct(productId)
      toast.success('Product duplicated successfully')
      fetchProducts()
    } catch (error) {
      console.error('Error duplicating product:', error)
      toast.error('Failed to duplicate product')
    }
  }

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId)
      toast.success('Product deleted successfully')
      setDeleteConfirm(null)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const brands = [...new Set(products.map(p => p.brand))].filter(Boolean)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <p className="text-slate-600 mt-1">{filteredProducts.length} products</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Published Filter */}
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="all">All Products</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-medium text-slate-900">Product</th>
                <th className="text-left p-4 font-medium text-slate-900">Brand</th>
                <th className="text-left p-4 font-medium text-slate-900">Price</th>
                <th className="text-left p-4 font-medium text-slate-900">Stock</th>
                <th className="text-left p-4 font-medium text-slate-900">Flags</th>
                <th className="text-left p-4 font-medium text-slate-900">Status</th>
                <th className="text-left p-4 font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.featuredImage}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-slate-900 line-clamp-1">{product.title}</div>
                        <div className="text-sm text-slate-600">{product.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-900">{product.brand}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{formatCurrency(product.price)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-900">{product.stockCount} units</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isNewArrival && <span className="badge badge-primary text-xs">New</span>}
                      {product.isDeal && <span className="badge badge-accent text-xs">Deal</span>}
                      {product.isLimitedStock && <span className="badge badge-warning text-xs">Limited</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    {product.published ? (
                      <span className="badge badge-success text-xs">Published</span>
                    ) : (
                      <span className="badge text-xs bg-slate-200 text-slate-700">Draft</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-primary-600"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(product.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600"
                        title="Duplicate"
                      >
                        <FiCopy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Delete Product?</h3>
            <p className="text-slate-600 mb-2">
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?
            </p>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsManagementPage