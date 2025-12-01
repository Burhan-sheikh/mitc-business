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
  writeBatch
} from 'firebase/firestore'
import { db } from '../firebase'
import { PRODUCT_LIMITS } from '../utils/constants'

const PRODUCTS_COLLECTION = 'products'

// Get all products with optional filters
export const getProducts = async (filters = {}) => {
  try {
    let q = collection(db, PRODUCTS_COLLECTION)
    
    // Apply filters
    const constraints = []
    
    if (filters.published !== undefined) {
      constraints.push(where('published', '==', filters.published))
    }
    
    if (filters.category) {
      constraints.push(where('category', 'array-contains', filters.category))
    }
    
    if (filters.brand) {
      constraints.push(where('brand', '==', filters.brand))
    }
    
    if (filters.isNewArrival) {
      constraints.push(where('isNewArrival', '==', true))
    }
    
    if (filters.isDeal) {
      constraints.push(where('isDeal', '==', true))
    }
    
    if (filters.isLimitedStock) {
      constraints.push(where('isLimitedStock', '==', true))
    }
    
    if (filters.isTopHighlight) {
      constraints.push(where('isTopHighlight', '==', true))
    }
    
    if (filters.isBottomHighlight) {
      constraints.push(where('isBottomHighlight', '==', true))
    }
    
    // Add ordering
    if (filters.orderBy) {
      constraints.push(orderBy(filters.orderBy, filters.orderDirection || 'desc'))
    } else {
      constraints.push(orderBy('createdAt', 'desc'))
    }
    
    // Add limit
    if (filters.limit) {
      constraints.push(limit(filters.limit))
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints)
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Get single product by ID
export const getProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Product not found')
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// Get product by slug
export const getProductBySlug = async (slug) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('slug', '==', slug),
      limit(1)
    )
    const snapshot = await getDocs(q)
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    } else {
      throw new Error('Product not found')
    }
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    throw error
  }
}

// Create new product
export const createProduct = async (productData) => {
  try {
    // Check total product limit
    const allProducts = await getProducts({})
    if (allProducts.length >= PRODUCT_LIMITS.TOTAL) {
      throw new Error(`Cannot exceed maximum of ${PRODUCT_LIMITS.TOTAL} products`)
    }
    
    const newProduct = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct)
    return { id: docRef.id, ...newProduct }
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    const updateData = {
      ...productData,
      updatedAt: serverTimestamp()
    }
    
    await updateDoc(docRef, updateData)
    return { id: productId, ...updateData }
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Duplicate product
export const duplicateProduct = async (productId) => {
  try {
    const product = await getProduct(productId)
    
    // Remove ID and modify title
    delete product.id
    product.title = `${product.title} (Copy)`
    product.slug = `${product.slug}-copy-${Date.now()}`
    product.published = false
    
    return await createProduct(product)
  } catch (error) {
    console.error('Error duplicating product:', error)
    throw error
  }
}

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    // This is a simple implementation
    // For better search, consider using Algolia or similar
    const products = await getProducts({ published: true })
    
    const term = searchTerm.toLowerCase()
    return products.filter(product => 
      product.title?.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term) ||
      product.model?.toLowerCase().includes(term) ||
      product.tags?.some(tag => tag.toLowerCase().includes(term))
    )
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

// Get related products
export const getRelatedProducts = async (productId, limit = 8) => {
  try {
    const product = await getProduct(productId)
    const products = await getProducts({ 
      published: true,
      brand: product.brand
    })
    
    // Filter out current product and limit results
    return products
      .filter(p => p.id !== productId)
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching related products:', error)
    throw error
  }
}

// Get products count by category
export const getProductsCountByCategory = async () => {
  try {
    const products = await getProducts({})
    
    return {
      total: products.length,
      topHighlight: products.filter(p => p.isTopHighlight).length,
      deals: products.filter(p => p.isDeal).length,
      newArrivals: products.filter(p => p.isNewArrival).length,
      limitedStock: products.filter(p => p.isLimitedStock).length,
      bottomHighlight: products.filter(p => p.isBottomHighlight).length,
      premium: products.filter(p => p.category?.includes('Premium')).length,
      standard: products.filter(p => p.category?.includes('Standard')).length,
      basic: products.filter(p => p.category?.includes('Basic')).length
    }
  } catch (error) {
    console.error('Error getting products count:', error)
    throw error
  }
}