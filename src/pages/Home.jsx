import { useState, useEffect, useCallback } from 'react'
import { getProducts } from '../services/productService'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilter from '../components/products/ProductFilter'
import SearchBar from '../components/products/SearchBar'
import { searchProducts } from '../services/productService'
import { FiGrid, FiList } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Home = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { products: fetchedProducts } = await getProducts()
        setProducts(fetchedProducts)
        setFilteredProducts(fetchedProducts)

        // Extract unique categories and brands
        const uniqueCategories = [...new Set(fetchedProducts.map(p => p.category))]
        const uniqueBrands = [...new Set(fetchedProducts.map(p => p.brand))]
        setCategories(uniqueCategories)
        setBrands(uniqueBrands)
      } catch (error) {
        console.error('Fetch products error:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let result = [...products]

    // Search filter
    if (searchTerm) {
      result = result.filter(product => {
        const searchableText = `${product.title} ${product.brand} ${product.category} ${product.tags?.join(' ')}`.toLowerCase()
        return searchableText.includes(searchTerm.toLowerCase())
      })
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }

    // Brand filter
    if (filters.brand) {
      result = result.filter(p => p.brand === filters.brand)
    }

    // Price filters
    if (filters.minPrice) {
      result = result.filter(p => p.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= Number(filters.maxPrice))
    }

    // Stock filter
    if (filters.inStock !== null && filters.inStock !== undefined) {
      result = result.filter(p => p.inStock === filters.inStock)
    }

    setFilteredProducts(result)
  }, [products, filters, searchTerm])

  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
  }, [])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Welcome to MITC
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Your trusted destination for quality laptops and computers in Kashmir
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-xl">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="Grid view"
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="List view"
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ProductFilter
          onFilterChange={handleFilterChange}
          categories={categories}
          brands={brands}
        />

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold">{filteredProducts.length}</span> product
            {filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          viewMode={viewMode}
        />
      </div>
    </div>
  )
}

export default Home
