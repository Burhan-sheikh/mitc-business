import { useState, useEffect } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const ProductFilter = ({ onFilterChange, categories, brands }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: null,
  })

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: null,
    })
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== '' && value !== null
  )

  return (
    <div className="mb-6">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center space-x-2 btn btn-secondary"
      >
        <FiFilter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="badge badge-primary ml-2">Active</span>
        )}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 card overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg">
                  Filter Products
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="label">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="select"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="label">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="select"
                  >
                    <option value="">All Brands</option>
                    {brands?.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="label">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="No limit"
                    className="input"
                  />
                </div>

                {/* Stock Status */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="label">Availability</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={filters.inStock === null}
                        onChange={() => handleFilterChange('inStock', null)}
                        className="form-radio text-primary-600"
                      />
                      <span>All</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={filters.inStock === true}
                        onChange={() => handleFilterChange('inStock', true)}
                        className="form-radio text-primary-600"
                      />
                      <span>In Stock</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        checked={filters.inStock === false}
                        onChange={() => handleFilterChange('inStock', false)}
                        className="form-radio text-primary-600"
                      />
                      <span>Out of Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary"
                  disabled={!hasActiveFilters}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductFilter
