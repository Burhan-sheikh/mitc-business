import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const USERS_COLLECTION = 'users'

// Get all users (admin)
export const getAllUsers = async () => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const users = []
    
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return users
  } catch (error) {
    console.error('Get all users error:', error)
    throw error
  }
}

// Get user by ID
export const getUser = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('User not found')
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    }
  } catch (error) {
    console.error('Get user error:', error)
    throw error
  }
}

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, userData)
  } catch (error) {
    console.error('Update user error:', error)
    throw error
  }
}

// Block/unblock user
export const toggleBlockUser = async (userId, isBlocked) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(docRef, { isBlocked })
  } catch (error) {
    console.error('Toggle block user error:', error)
    throw error
  }
}

// Delete user
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId))
  } catch (error) {
    console.error('Delete user error:', error)
    throw error
  }
}

// Get users with deletion requests
export const getUsersWithDeletionRequests = async () => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('deletionRequested', '==', true),
      orderBy('deletionRequestedAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const users = []
    
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return users
  } catch (error) {
    console.error('Get deletion requests error:', error)
    throw error
  }
}
