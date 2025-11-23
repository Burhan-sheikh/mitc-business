import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, getSimilarProducts } from '../services/productService'
import { getProductReviews, createReview, markReviewHelpful, reportReview } from '../services/reviewService'
import { useAuth } from '../contexts/AuthContext'
import ImageGallery from '../components/products/ImageGallery'
import StarRating from '../components/reviews/StarRating'
import ReviewCard from '../components/reviews/ReviewCard'
import ReviewForm from '../components/reviews/ReviewForm'
import ChatWidget from '../components/chat/ChatWidget'
import ProductCard from '../components/products/ProductCard'
import Loading from '../components/common/Loading'
import Card from '../components/common/Card'
import { FiCheckCircle, FiXCircle, FiTag, FiPackage } from 'react-icons/fi'
import { formatCurrency, calculateAverageRating } from '../utils/helpers'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const ProductDetail = () => {
  const { id } = useParams()
  const { currentUser, userData } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const productData = await getProduct(id)
        setProduct(productData)

        // Fetch reviews
        setReviewsLoading(true)
        const productReviews = await getProductReviews(id)
        setReviews(productReviews)
        setReviewsLoading(false)

        // Fetch similar products
        const similar = await getSimilarProducts(id, productData.category)
        setSimilarProducts(similar)
      } catch (error) {
        console.error('Fetch product error:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmitReview = async (reviewData) => {
    if (!currentUser) {
      toast.error('Please login to submit a review')
      return
    }

    setSubmittingReview(true)
    try {
      await createReview(
        { ...reviewData, productId: id },
        currentUser.uid,
        userData?.displayName || 'Anonymous'
      )
      
      // Refresh reviews
      const updatedReviews = await getProductReviews(id)
      setReviews(updatedReviews)
    } catch (error) {
      throw error
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleMarkHelpful = async (reviewId) => {
    try {
      await markReviewHelpful(reviewId)
      const updatedReviews = await getProductReviews(id)
      setReviews(updatedReviews)
      toast.success('Marked as helpful')
    } catch (error) {
      toast.error('Failed to mark as helpful')
    }
  }

  const handleReportReview = async (reviewId) => {
    try {
      await reportReview(reviewId)
      toast.success('Review reported')
    } catch (error) {
      toast.error('Failed to report review')
    }
  }

  if (loading) {
    return <Loading fullScreen />
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The product you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      </div>
    )
  }

  const averageRating = calculateAverageRating(reviews)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <a href="/" className="text-primary-600 dark:text-primary-400 hover:underline">
            Home
          </a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">{product.category}</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ImageGallery images={product.images} title={product.title} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              {/* Brand */}
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-medium mb-2">
                {product.brand}
              </p>

              {/* Title */}
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="mb-4">
                  <StarRating
                    rating={parseFloat(averageRating)}
                    size="lg"
                    showCount
                    count={reviews.length}
                  />
                </div>
              )}

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  In-store pricing only • No online ordering
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <FiCheckCircle className="w-5 h-5" />
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <FiXCircle className="w-5 h-5" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {product.shortDescription}
                </p>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <FiTag className="w-5 h-5 text-gray-400 mt-1" />
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Category */}
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-6">
                <FiPackage className="w-5 h-5" />
                <span>Category: <span className="font-medium">{product.category}</span></span>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card>
              <h2 className="text-2xl font-display font-bold mb-6">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{key}</span>
                    <span className="text-gray-600 dark:text-gray-400">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Highlights */}
        {product.highlights && product.highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <h2 className="text-2xl font-display font-bold mb-6">Highlights</h2>
              <ul className="space-y-2">
                {product.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-display font-bold mb-6">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <ReviewForm onSubmit={handleSubmitReview} loading={submittingReview} />
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {reviewsLoading ? (
                <Loading />
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onMarkHelpful={handleMarkHelpful}
                      onReport={handleReportReview}
                      currentUserId={currentUser?.uid}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </motion.div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-display font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Widget */}
      <ChatWidget productId={id} />
    </div>
  )
}

export default ProductDetail
