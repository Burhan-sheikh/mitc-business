import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const REVIEWS_COLLECTION = 'reviews'

// Get reviews for a product
export const getProductReviews = async (productId) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const reviews = []
    
    snapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return reviews
  } catch (error) {
    console.error('Get reviews error:', error)
    throw error
  }
}

// Get all reviews (admin)
export const getAllReviews = async () => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const reviews = []
    
    snapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return reviews
  } catch (error) {
    console.error('Get all reviews error:', error)
    throw error
  }
}

// Create review
export const createReview = async (reviewData, userId, userName) => {
  try {
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...reviewData,
      userId,
      userName,
      createdAt: serverTimestamp(),
      verified: false,
      helpful: 0,
      reported: false,
    })

    return docRef.id
  } catch (error) {
    console.error('Create review error:', error)
    throw error
  }
}

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId)
    await updateDoc(docRef, reviewData)
  } catch (error) {
    console.error('Update review error:', error)
    throw error
  }
}

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, reviewId))
  } catch (error) {
    console.error('Delete review error:', error)
    throw error
  }
}

// Mark review as helpful
export const markReviewHelpful = async (reviewId) => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        helpful: (docSnap.data().helpful || 0) + 1,
      })
    }
  } catch (error) {
    console.error('Mark helpful error:', error)
    throw error
  }
}

// Report review
export const reportReview = async (reviewId) => {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId)
    await updateDoc(docRef, {
      reported: true,
    })
  } catch (error) {
    console.error('Report review error:', error)
    throw error
  }
}
