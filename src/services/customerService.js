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
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import { WARRANTY_PERIOD_DAYS, CUSTOMER_STATUS } from '../utils/constants'

const CUSTOMERS_COLLECTION = 'customers'

// Calculate warranty end date
const calculateWarrantyEndDate = (purchaseDate) => {
  const date = new Date(purchaseDate)
  date.setDate(date.getDate() + WARRANTY_PERIOD_DAYS)
  return date.toISOString()
}

// Get all customers
export const getCustomers = async (filters = {}) => {
  try {
    let q = collection(db, CUSTOMERS_COLLECTION)
    
    const constraints = []
    
    if (filters.status) {
      constraints.push(where('status', '==', filters.status))
    }
    
    constraints.push(orderBy('purchaseDate', 'desc'))
    
    if (constraints.length > 0) {
      q = query(q, ...constraints)
    }
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}

// Get single customer
export const getCustomer = async (customerId) => {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, customerId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Customer not found')
    }
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw error
  }
}

// Create new customer
export const createCustomer = async (customerData) => {
  try {
    const warrantyEndDate = calculateWarrantyEndDate(customerData.purchaseDate)
    
    const newCustomer = {
      ...customerData,
      warrantyEndDate,
      status: CUSTOMER_STATUS.ACTIVE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), newCustomer)
    return { id: docRef.id, ...newCustomer }
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

// Update customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, customerId)
    
    const updateData = {
      ...customerData,
      updatedAt: serverTimestamp()
    }
    
    // Recalculate warranty end date if purchase date changed
    if (customerData.purchaseDate) {
      updateData.warrantyEndDate = calculateWarrantyEndDate(customerData.purchaseDate)
    }
    
    await updateDoc(docRef, updateData)
    return { id: customerId, ...updateData }
  } catch (error) {
    console.error('Error updating customer:', error)
    throw error
  }
}

// Delete customer
export const deleteCustomer = async (customerId) => {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, customerId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw error
  }
}

// Get customers with expiring warranties
export const getExpiringWarranties = async (daysAhead = 3) => {
  try {
    const customers = await getCustomers({ status: CUSTOMER_STATUS.ACTIVE })
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + daysAhead)
    
    return customers.filter(customer => {
      const warrantyDate = new Date(customer.warrantyEndDate)
      return warrantyDate >= today && warrantyDate <= futureDate
    })
  } catch (error) {
    console.error('Error fetching expiring warranties:', error)
    throw error
  }
}

// Get customers with expired warranties
export const getExpiredWarranties = async () => {
  try {
    const customers = await getCustomers({ status: CUSTOMER_STATUS.ACTIVE })
    const today = new Date()
    
    return customers.filter(customer => {
      const warrantyDate = new Date(customer.warrantyEndDate)
      return warrantyDate < today
    })
  } catch (error) {
    console.error('Error fetching expired warranties:', error)
    throw error
  }
}

// Update customer status
export const updateCustomerStatus = async (customerId, status) => {
  try {
    return await updateCustomer(customerId, { status })
  } catch (error) {
    console.error('Error updating customer status:', error)
    throw error
  }
}

// Search customers
export const searchCustomers = async (searchTerm) => {
  try {
    const customers = await getCustomers({})
    const term = searchTerm.toLowerCase()
    
    return customers.filter(customer =>
      customer.name?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.phone?.includes(term)
    )
  } catch (error) {
    console.error('Error searching customers:', error)
    throw error
  }
}