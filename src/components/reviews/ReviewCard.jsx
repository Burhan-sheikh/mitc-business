import { FiStar, FiThumbsUp, FiFlag } from 'react-icons/fi'
import { formatRelativeTime } from '../../utils/helpers'
import { motion } from 'framer-motion'

const ReviewCard = ({ review, onMarkHelpful, onReport, currentUserId }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  const isOwnReview = currentUserId === review.userId

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {review.userName}
            </h4>
            {review.verified && (
              <span className="badge badge-success text-xs">Verified</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {review.comment}
      </p>

      {/* Actions */}
      <div className="flex items-center space-x-4 text-sm">
        {!isOwnReview && (
          <>
            <button
              onClick={() => onMarkHelpful(review.id)}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful || 0})</span>
            </button>
            <button
              onClick={() => onReport(review.id)}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <FiFlag className="w-4 h-4" />
              <span>Report</span>
            </button>
          </>
        )}
        {isOwnReview && (
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            Your review
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default ReviewCard
