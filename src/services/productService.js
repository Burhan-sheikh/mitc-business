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
  startAfter,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const PRODUCTS_COLLECTION = 'products'

// Get all products with pagination
export const getProducts = async (filters = {}, pageSize = 12, lastDoc = null) => {
  try {
    let q = query(collection(db, PRODUCTS_COLLECTION))

    // Apply filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category))
    }
    if (filters.brand) {
      q = query(q, where('brand', '==', filters.brand))
    }
    if (filters.inStock !== undefined) {
      q = query(q, where('inStock', '==', filters.inStock))
    }
    if (filters.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice))
    }
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice))
    }

    // Ordering
    q = query(q, orderBy(filters.orderBy || 'createdAt', filters.orderDir || 'desc'))

    // Pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }
    q = query(q, limit(pageSize))

    const snapshot = await getDocs(q)
    const products = []
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return {
      products,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === pageSize,
    }
  } catch (error) {
    console.error('Get products error:', error)
    throw error
  }
}

// Get single product
export const getProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Product not found')
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    }
  } catch (error) {
    console.error('Get product error:', error)
    throw error
  }
}

// Create product
export const createProduct = async (productData, userId) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    })

    return docRef.id
  } catch (error) {
    console.error('Create product error:', error)
    throw error
  }
}

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Update product error:', error)
    throw error
  }
}

// Delete product
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId))
  } catch (error) {
    console.error('Delete product error:', error)
    throw error
  }
}

// Duplicate product
export const duplicateProduct = async (productId, userId) => {
  try {
    const product = await getProduct(productId)
    delete product.id
    product.title = `${product.title} (Copy)`
    return await createProduct(product, userId)
  } catch (error) {
    console.error('Duplicate product error:', error)
    throw error
  }
}

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    // Note: This is a basic search. For production, consider using Algolia or similar
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION))
    const products = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      const searchableText = `${data.title} ${data.brand} ${data.category} ${data.tags?.join(' ')}`.toLowerCase()
      
      if (searchableText.includes(searchTerm.toLowerCase())) {
        products.push({
          id: doc.id,
          ...data,
        })
      }
    })

    return products
  } catch (error) {
    console.error('Search products error:', error)
    throw error
  }
}

// Get similar products
export const getSimilarProducts = async (productId, category, limit = 4) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(limit + 1) // Get one extra to exclude current product
    )

    const snapshot = await getDocs(q)
    const products = []
    
    snapshot.forEach((doc) => {
      if (doc.id !== productId) {
        products.push({
          id: doc.id,
          ...doc.data(),
        })
      }
    })

    return products.slice(0, limit)
  } catch (error) {
    console.error('Get similar products error:', error)
    throw error
  }
}
