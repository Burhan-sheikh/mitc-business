import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCustomers, createCustomer, updateCustomerStatus } from '../../services/customerService'
import { formatDate, daysUntil, isWarrantyExpiringSoon, isWarrantyExpired } from '../../utils/helpers'
import { CUSTOMER_STATUS } from '../../utils/constants'
import { FiPlus, FiSearch, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CustomersPage = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm, statusFilter])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const data = await getCustomers({})
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = [...customers]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.includes(term)
      )
    }

    setFilteredCustomers(filtered)
  }

  const handleStatusChange = async (customerId, newStatus) => {
    try {
      await updateCustomerStatus(customerId, newStatus)
      toast.success('Status updated')
      fetchCustomers()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const getWarrantyBadge = (warrantyEndDate, status) => {
    if (status !== CUSTOMER_STATUS.ACTIVE) return null

    if (isWarrantyExpired(warrantyEndDate)) {
      return <span className="badge badge-danger text-xs">Expired</span>
    }
    if (isWarrantyExpiringSoon(warrantyEndDate)) {
      return <span className="badge badge-warning text-xs">Expiring Soon</span>
    }
    return <span className="badge badge-success text-xs">Active</span>
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
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600 mt-1">{filteredCustomers.length} total customers</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <FiPlus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="all">All Statuses</option>
            <option value={CUSTOMER_STATUS.ACTIVE}>Active</option>
            <option value={CUSTOMER_STATUS.WARRANTY_EXPIRED}>Warranty Expired</option>
            <option value={CUSTOMER_STATUS.REVIEW_REQUESTED}>Review Requested</option>
            <option value={CUSTOMER_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-medium text-slate-900">Customer</th>
                <th className="text-left p-4 font-medium text-slate-900">Product</th>
                <th className="text-left p-4 font-medium text-slate-900">Purchase Date</th>
                <th className="text-left p-4 font-medium text-slate-900">Warranty End</th>
                <th className="text-left p-4 font-medium text-slate-900">Status</th>
                <th className="text-left p-4 font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-slate-900">{customer.name}</div>
                      <div className="text-sm text-slate-600">{customer.email}</div>
                      <div className="text-sm text-slate-600">{customer.phone}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-900">{customer.productDetails || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-900">{formatDate(customer.purchaseDate)}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-900">{formatDate(customer.warrantyEndDate)}</div>
                    <div className="mt-1">
                      {getWarrantyBadge(customer.warrantyEndDate, customer.status)}
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={customer.status}
                      onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                      className="text-sm border border-slate-300 rounded px-2 py-1"
                    >
                      <option value={CUSTOMER_STATUS.ACTIVE}>Active</option>
                      <option value={CUSTOMER_STATUS.WARRANTY_EXPIRED}>Warranty Expired</option>
                      <option value={CUSTOMER_STATUS.REVIEW_REQUESTED}>Review Requested</option>
                      <option value={CUSTOMER_STATUS.COMPLETED}>Completed</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/admin/customers/${customer.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              No customers found
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchCustomers()
          }}
        />
      )}
    </div>
  )
}

const AddCustomerModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    productDetails: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createCustomer(formData)
      toast.success('Customer added successfully')
      onSuccess()
    } catch (error) {
      console.error('Error creating customer:', error)
      toast.error('Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold">Add New Customer</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Purchase Date *</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Details</label>
            <input
              type="text"
              name="productDetails"
              value={formData.productDetails}
              onChange={handleChange}
              placeholder="e.g., HP Pavilion 15, i5-1240P, 16GB RAM"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomersPage