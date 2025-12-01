import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import { REVIEW_STATUS } from '../utils/constants'

const REVIEWS_COLLECTION = 'storeReviews'

// Get all reviews
export const getReviews = async (filters = {}) => {
  try {
    let q = collection(db, REVIEWS_COLLECTION)
    
    const constraints = []
    
    if (filters.status) {
      constraints.push(where('status', '==', filters.status))
    }
    
    constraints.push(orderBy('createdAt', 'desc'))
    
    if (filters.limit) {
      constraints.push(limit(filters.limit))
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints)
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

// Get single review
export const getReview = async (reviewId) => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Review not found')
    }
  } catch (error) {
    console.error('Error fetching review:', error)
    throw error
  }
}

// Create new review
export const createReview = async (reviewData) => {
  try {
    const newReview = {
      ...reviewData,
      status: REVIEW_STATUS.PENDING,
      createdAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), newReview)
    return { id: docRef.id, ...newReview }
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId)
    await updateDoc(docRef, reviewData)
    return { id: reviewId, ...reviewData }
  } catch (error) {
    console.error('Error updating review:', error)
    throw error
  }
}

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}

// Approve review
export const approveReview = async (reviewId) => {
  try {
    return await updateReview(reviewId, { status: REVIEW_STATUS.APPROVED })
  } catch (error) {
    console.error('Error approving review:', error)
    throw error
  }
}

// Reject review
export const rejectReview = async (reviewId) => {
  try {
    return await updateReview(reviewId, { status: REVIEW_STATUS.REJECTED })
  } catch (error) {
    console.error('Error rejecting review:', error)
    throw error
  }
}

// Get approved reviews for public display
export const getApprovedReviews = async (limitCount = 10) => {
  try {
    return await getReviews({ 
      status: REVIEW_STATUS.APPROVED,
      limit: limitCount 
    })
  } catch (error) {
    console.error('Error fetching approved reviews:', error)
    throw error
  }
}

// Get average rating
export const getAverageRating = async () => {
  try {
    const reviews = await getReviews({ status: REVIEW_STATUS.APPROVED })
    
    if (reviews.length === 0) return 0
    
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
    return (sum / reviews.length).toFixed(1)
  } catch (error) {
    console.error('Error calculating average rating:', error)
    throw error
  }
}

// Get reviews count by rating
export const getReviewsCountByRating = async () => {
  try {
    const reviews = await getReviews({ status: REVIEW_STATUS.APPROVED })
    
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[review.rating]++
      }
    })
    
    return counts
  } catch (error) {
    console.error('Error counting reviews by rating:', error)
    throw error
  }
}