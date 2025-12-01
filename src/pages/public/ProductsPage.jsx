import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts, searchProducts } from '../../services/productService'
import { formatCurrency, getStockStatus } from '../../utils/helpers'
import { LAPTOP_BRANDS, PRODUCT_CATEGORIES, PRODUCT_CONDITIONS, PRICE_RANGES } from '../../utils/constants'
import { FiGrid, FiList, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  
  // Filters
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity })
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showLimitedOnly, setShowLimitedOnly] = useState(false)
  const [showDealsOnly, setShowDealsOnly] = useState(false)

  useEffect(() => {
    const searchQuery = searchParams.get('search')
    const filterParam = searchParams.get('filter')
    
    if (searchQuery) {
      handleSearch(searchQuery)
    } else {
      fetchProducts(filterParam)
    }
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [products, selectedBrands, selectedCategories, selectedConditions, priceRange, showNewOnly, showLimitedOnly, showDealsOnly])

  const fetchProducts = async (filter = null) => {
    try {
      setLoading(true)
      let filters = { published: true }
      
      if (filter === 'new') filters.isNewArrival = true
      if (filter === 'limited') filters.isLimitedStock = true
      if (filter === 'deals') filters.isDeal = true
      
      const data = await getProducts(filters)
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    try {
      setLoading(true)
      const results = await searchProducts(query)
      setProducts(results)
    } catch (error) {
      console.error('Error searching products:', error)
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        p.category && selectedCategories.some(cat => p.category.includes(cat))
      )
    }

    // Condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(p => selectedConditions.includes(p.condition))
    }

    // Price range filter
    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    )

    // Flag filters
    if (showNewOnly) filtered = filtered.filter(p => p.isNewArrival)
    if (showLimitedOnly) filtered = filtered.filter(p => p.isLimitedStock)
    if (showDealsOnly) filtered = filtered.filter(p => p.isDeal)

    setFilteredProducts(filtered)
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
    setSelectedConditions([])
    setPriceRange({ min: 0, max: Infinity })
    setShowNewOnly(false)
    setShowLimitedOnly(false)
    setShowDealsOnly(false)
  }

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const toggleCondition = (condition) => {
    setSelectedConditions(prev => 
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedConditions.length > 0 || showNewOnly || showLimitedOnly || showDealsOnly) && (
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
                  Clear All
                </button>
              )}
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Brand</h3>
              <div className="space-y-2">
                {LAPTOP_BRANDS.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                {['Premium', 'Standard', 'Basic'].map(category => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Condition</h3>
              <div className="space-y-2">
                {PRODUCT_CONDITIONS.map(condition => (
                  <label key={condition} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedConditions.includes(condition)}
                      onChange={() => toggleCondition(condition)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range, index) => (
                  <label key={index} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange.min === range.min && priceRange.max === range.max}
                      onChange={() => setPriceRange({ min: range.min, max: range.max })}
                      className="border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Special</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNewOnly}
                    onChange={(e) => setShowNewOnly(e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">New Arrivals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLimitedOnly}
                    onChange={(e) => setShowLimitedOnly(e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">Limited Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDealsOnly}
                    onChange={(e) => setShowDealsOnly(e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">Deals</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'All Products'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{filteredProducts.length} products</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'}`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'}`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">No products found matching your criteria.</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map(product => (
                viewMode === 'grid' ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <ProductListItem key={product.id} product={product} />
                )
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product }) => {
  const stockStatus = getStockStatus(product.stockCount, product.isLimitedStock)

  return (
    <Link to={`/products/${product.id}`} className="card hover:shadow-lg transition-shadow group">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.featuredImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isNewArrival && <div className="badge badge-primary">NEW</div>}
          {product.isDeal && <div className="badge badge-accent">DEAL</div>}
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm text-slate-600 mb-1">{product.brand}</div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.shortSlogan}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold text-primary-600">{formatCurrency(product.price)}</div>
          <span className={`text-xs font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
        </div>
        <div className="text-xs text-slate-500">{product.condition}</div>
      </div>
    </Link>
  )
}

// Product List Item Component
const ProductListItem = ({ product }) => {
  const stockStatus = getStockStatus(product.stockCount, product.isLimitedStock)

  return (
    <Link to={`/products/${product.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="flex gap-4 p-4">
        <div className="w-32 h-32 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
          <img src={product.featuredImage} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-600 mb-1">{product.brand}</div>
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{product.shortSlogan}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 mb-2">{formatCurrency(product.price)}</div>
              <div className="flex gap-2 flex-wrap justify-end">
                {product.isNewArrival && <div className="badge badge-primary text-xs">NEW</div>}
                {product.isDeal && <div className="badge badge-accent text-xs">DEAL</div>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600">{product.condition}</span>
            <span className="text-slate-400">•</span>
            <span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductsPage