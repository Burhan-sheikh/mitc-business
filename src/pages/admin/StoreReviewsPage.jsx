import { useState, useEffect } from 'react'
import { getReviews, approveReview, rejectReview, deleteReview } from '../../services/reviewService'
import { formatDate, downloadCSV, downloadJSON } from '../../utils/helpers'
import { REVIEW_STATUS } from '../../utils/constants'
import { FiDownload, FiCheck, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const StoreReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviews, statusFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await getReviews({})
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    if (statusFilter === 'all') {
      setFilteredReviews(reviews)
    } else {
      setFilteredReviews(reviews.filter(r => r.status === statusFilter))
    }
  }

  const handleApprove = async (reviewId) => {
    try {
      await approveReview(reviewId)
      toast.success('Review approved')
      fetchReviews()
    } catch (error) {
      console.error('Error approving review:', error)
      toast.error('Failed to approve review')
    }
  }

  const handleReject = async (reviewId) => {
    try {
      await rejectReview(reviewId)
      toast.success('Review rejected')
      fetchReviews()
    } catch (error) {
      console.error('Error rejecting review:', error)
      toast.error('Failed to reject review')
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      await deleteReview(reviewId)
      toast.success('Review deleted')
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    }
  }

  const handleExportCSV = () => {
    const data = filteredReviews.map(r => ({
      Customer: r.customerName,
      Rating: r.rating,
      Title: r.title,
      Comment: r.comment,
      Status: r.status,
      Date: formatDate(r.createdAt)
    }))
    downloadCSV(data, 'store-reviews.csv')
    toast.success('Exported to CSV')
  }

  const handleExportJSON = () => {
    downloadJSON(filteredReviews, 'store-reviews.json')
    toast.success('Exported to JSON')
  }

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Store Reviews</h1>
          <p className="text-slate-600 mt-1">{filteredReviews.length} total reviews</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary">
            <FiDownload className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={handleExportJSON} className="btn-secondary">
            <FiDownload className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setStatusFilter(REVIEW_STATUS.PENDING)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === REVIEW_STATUS.PENDING
                ? 'bg-yellow-100 text-yellow-700 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending ({reviews.filter(r => r.status === REVIEW_STATUS.PENDING).length})
          </button>
          <button
            onClick={() => setStatusFilter(REVIEW_STATUS.APPROVED)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === REVIEW_STATUS.APPROVED
                ? 'bg-green-100 text-green-700 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Approved ({reviews.filter(r => r.status === REVIEW_STATUS.APPROVED).length})
          </button>
          <button
            onClick={() => setStatusFilter(REVIEW_STATUS.REJECTED)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFilter === REVIEW_STATUS.REJECTED
                ? 'bg-red-100 text-red-700 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rejected ({reviews.filter(r => r.status === REVIEW_STATUS.REJECTED).length})
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{review.customerName}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${
                        i < review.rating ? 'text-yellow-400' : 'text-slate-300'
                      }`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {review.title && (
                  <h4 className="font-medium text-slate-900 mb-2">{review.title}</h4>
                )}
                <p className="text-slate-700 mb-3">{review.comment}</p>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{formatDate(review.createdAt, 'long')}</span>
                  {review.source && <span>• Source: {review.source}</span>}
                </div>
              </div>
              <div>
                {review.status === REVIEW_STATUS.PENDING && (
                  <span className="badge badge-warning">Pending</span>
                )}
                {review.status === REVIEW_STATUS.APPROVED && (
                  <span className="badge badge-success">Approved</span>
                )}
                {review.status === REVIEW_STATUS.REJECTED && (
                  <span className="badge badge-danger">Rejected</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-slate-200">
              {review.status !== REVIEW_STATUS.APPROVED && (
                <button
                  onClick={() => handleApprove(review.id)}
                  className="btn-secondary text-sm"
                >
                  <FiCheck className="w-4 h-4" />
                  Approve
                </button>
              )}
              {review.status !== REVIEW_STATUS.REJECTED && (
                <button
                  onClick={() => handleReject(review.id)}
                  className="btn-secondary text-sm"
                >
                  <FiX className="w-4 h-4" />
                  Reject
                </button>
              )}
              <button
                onClick={() => handleDelete(review.id)}
                className="text-sm px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="card p-12 text-center text-slate-600">
            No reviews found
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreReviewsPage