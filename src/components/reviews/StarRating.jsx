import { FiStar } from 'react-icons/fi'

const StarRating = ({ rating, size = 'md', showCount = false, count = 0 }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const starClass = sizeClasses[size] || sizeClasses.md

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`${starClass} ${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex">{renderStars()}</div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {rating.toFixed(1)}
      </span>
      {showCount && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}

export default StarRating
