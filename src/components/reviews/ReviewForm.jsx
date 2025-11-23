import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import Button from '../common/Button'
import { validateReview } from '../../utils/validation'
import toast from 'react-hot-toast'

const ReviewForm = ({ onSubmit, loading }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    const reviewData = { rating, comment }
    const { isValid, errors: validationErrors } = validateReview(reviewData)

    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    try {
      await onSubmit(reviewData)
      // Reset form
      setRating(0)
      setComment('')
      setErrors({})
      toast.success('Review submitted successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to submit review')
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= (hoveredRating || rating)

      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <FiStar
            className={`w-8 h-8 ${
              isFilled
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      )
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h3 className="font-display font-semibold text-lg mb-4">
        Write a Review
      </h3>

      {/* Rating */}
      <div>
        <label className="label">Rating *</label>
        <div className="flex items-center space-x-1">
          {renderStars()}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating} star{rating !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="label">Your Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this product..."
          className="textarea"
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Minimum 10 characters
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {comment.length} / 1000
          </p>
        </div>
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        Submit Review
      </Button>
    </form>
  )
}

export default ReviewForm
