import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign up with email and password
  const signUp = async (email, password, displayName) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile
      await updateProfile(user, { displayName })

      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: 'user',
        photoURL: null,
        createdAt: new Date(),
        lastLogin: new Date(),
        isBlocked: false,
        deletionRequested: false,
      })

      toast.success('Account created successfully!')
      return user
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date(),
      })

      toast.success('Welcome back!')
      return user
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid))

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'user',
          photoURL: user.photoURL,
          createdAt: new Date(),
          lastLogin: new Date(),
          isBlocked: false,
          deletionRequested: false,
        })
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date(),
        })
      }

      toast.success('Welcome!')
      return user
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setCurrentUser(null)
      setUserData(null)
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Request account deletion
  const requestAccountDeletion = async () => {
    try {
      if (!currentUser) throw new Error('No user logged in')

      await updateDoc(doc(db, 'users', currentUser.uid), {
        deletionRequested: true,
        deletionRequestedAt: new Date(),
      })

      toast.success('Account deletion requested. Admin will process your request.')
    } catch (error) {
      console.error('Delete request error:', error)
      throw error
    }
  }

  // Delete account (admin or self)
  const deleteAccount = async (uid, deleteData = false) => {
    try {
      if (deleteData) {
        // Delete user document
        await deleteDoc(doc(db, 'users', uid))
        // TODO: Delete user's reviews and other data
      }

      if (currentUser && currentUser.uid === uid) {
        await firebaseDeleteUser(currentUser)
        setCurrentUser(null)
        setUserData(null)
      }

      toast.success('Account deleted successfully')
    } catch (error) {
      console.error('Delete account error:', error)
      throw error
    }
  }

  // Fetch user data
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      }
    } catch (error) {
      console.error('Fetch user data error:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserData(user.uid)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    requestAccountDeletion,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
