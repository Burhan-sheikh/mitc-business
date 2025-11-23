import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { formatCurrency } from '../../utils/helpers'
import Card from '../common/Card'

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <Card hover className="h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            {product.inStock ? (
              <span className="badge badge-success flex items-center space-x-1">
                <FiCheckCircle className="w-3 h-3" />
                <span>In Stock</span>
              </span>
            ) : (
              <span className="badge badge-danger flex items-center space-x-1">
                <FiXCircle className="w-3 h-3" />
                <span>Out of Stock</span>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Brand */}
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
            {product.brand}
          </p>

          {/* Title */}
          <h3 className="font-display font-semibold text-gray-900 dark:text-white line-clamp-2">
            {product.title}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(product.price)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              In-store pricing only
            </p>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            <FiShoppingBag className="w-4 h-4" />
            <span>View Details</span>
          </motion.div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
