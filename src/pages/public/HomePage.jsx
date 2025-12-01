import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../services/productService'
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi'
import { formatCurrency, truncateText } from '../../utils/helpers'
import toast from 'react-hot-toast'

const HomePage = () => {
  const [topHighlights, setTopHighlights] = useState([])
  const [deals, setDeals] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [limitedStock, setLimitedStock] = useState([])
  const [premiumProducts, setPremiumProducts] = useState([])
  const [standardProducts, setStandardProducts] = useState([])
  const [basicProducts, setBasicProducts] = useState([])
  const [bottomHighlights, setBottomHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDealIndex, setCurrentDealIndex] = useState(0)

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const fetchAllProducts = async () => {
    try {
      // Fetch all sections in parallel
      const [top, dealsData, newData, limitedData, premiumData, standardData, basicData, bottom] = await Promise.all([
        getProducts({ isTopHighlight: true, published: true, limit: 10 }),
        getProducts({ isDeal: true, published: true, limit: 10 }),
        getProducts({ isNewArrival: true, published: true, limit: 10 }),
        getProducts({ isLimitedStock: true, published: true, limit: 10 }),
        getProducts({ category: 'Premium', published: true, limit: 10 }),
        getProducts({ category: 'Standard', published: true, limit: 10 }),
        getProducts({ category: 'Basic', published: true, limit: 10 }),
        getProducts({ isBottomHighlight: true, published: true, limit: 10 })
      ])

      setTopHighlights(top)
      setDeals(dealsData)
      setNewArrivals(newData)
      setLimitedStock(limitedData)
      setPremiumProducts(premiumData)
      setStandardProducts(standardData)
      setBasicProducts(basicData)
      setBottomHighlights(bottom)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const nextDeal = () => {
    setCurrentDealIndex((prev) => (prev + 1) % deals.length)
  }

  const prevDeal = () => {
    setCurrentDealIndex((prev) => (prev - 1 + deals.length) % deals.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Top Highlights Bar */}
      {topHighlights.length > 0 && (
        <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {topHighlights.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <span className="font-medium">{product.title}</span>
                <span className="text-primary-100">•</span>
                <span>{formatCurrency(product.price)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Deals Banner Slider */}
      {deals.length > 0 && (
        <section className="relative h-[400px] bg-slate-900 overflow-hidden">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentDealIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${deal.featuredImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/50" />
                <div className="container-custom h-full flex items-center relative z-10">
                  <div className="max-w-2xl text-white">
                    <div className="badge badge-accent mb-4">DEAL</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{deal.title}</h2>
                    <p className="text-xl mb-6">{deal.shortSlogan}</p>
                    <div className="text-3xl font-bold mb-6">{formatCurrency(deal.price)}</div>
                    <Link to={`/products/${deal.id}`} className="btn-primary btn-lg">
                      View Details
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevDeal}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors z-20"
          >
            <FiChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextDeal}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors z-20"
          >
            <FiChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {deals.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDealIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentDealIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <Link to="/products?filter=new" className="text-primary-600 hover:text-primary-700 font-medium">
                View All <FiArrowRight className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} badge="NEW" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Limited Stock Section */}
      {limitedStock.length > 0 && (
        <section className="section-padding bg-slate-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Limited Stock</h2>
              <Link to="/products?filter=limited" className="text-primary-600 hover:text-primary-700 font-medium">
                View All <FiArrowRight className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {limitedStock.map((product) => (
                <ProductCard key={product.id} product={product} badge="LIMITED" badgeColor="warning" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore by Category</h2>

          {/* Premium */}
          {premiumProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Premium Laptops</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {premiumProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Standard */}
          {standardProducts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Standard Laptops</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {standardProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Basic */}
          {basicProducts.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">Basic Laptops</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {basicProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Highlights Bar */}
      {bottomHighlights.length > 0 && (
        <section className="bg-slate-900 text-white py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            {bottomHighlights.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="inline-flex items-center gap-2 hover:underline"
              >
                <span className="font-medium">{product.title}</span>
                <span className="text-slate-400">•</span>
                <span>{formatCurrency(product.price)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Product Card Component
const ProductCard = ({ product, badge = null, badgeColor = 'primary' }) => {
  const badgeClasses = {
    primary: 'badge-primary',
    warning: 'badge-warning',
    accent: 'badge-accent'
  }

  return (
    <Link to={`/products/${product.id}`} className="card hover:shadow-lg transition-shadow group">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.featuredImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className={`absolute top-3 right-3 badge ${badgeClasses[badgeColor]}`}>
            {badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm text-slate-600 mb-1">{product.brand}</div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.shortSlogan}</p>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary-600">{formatCurrency(product.price)}</div>
          {product.stockCount <= 3 && product.stockCount > 0 && (
            <span className="text-xs text-yellow-600 font-medium">Only {product.stockCount} left</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default HomePage