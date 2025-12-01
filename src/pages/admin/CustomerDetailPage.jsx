import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCustomer, updateCustomer, deleteCustomer } from '../../services/customerService'
import { formatDate, daysUntil, isWarrantyExpiringSoon, isWarrantyExpired } from '../../utils/helpers'
import { FiArrowLeft, FiCalendar, FiMail, FiPhone, FiPackage, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CustomerDetailPage = () => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      const data = await getCustomer(customerId)
      setCustomer(data)
    } catch (error) {
      console.error('Error fetching customer:', error)
      toast.error('Customer not found')
      navigate('/admin/customers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCustomer(customerId)
      toast.success('Customer deleted')
      navigate('/admin/customers')
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('Failed to delete customer')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!customer) return null

  const warrantyDaysLeft = daysUntil(customer.warrantyEndDate)
  const expired = isWarrantyExpired(customer.warrantyEndDate)
  const expiringSoon = isWarrantyExpiringSoon(customer.warrantyEndDate)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/customers')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <FiArrowLeft />
          Back to Customers
        </button>
        <h1 className="text-3xl font-bold text-slate-900">{customer.name}</h1>
        <p className="text-slate-600 mt-1">Customer Details</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiMail className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Email</div>
                  <div className="font-medium">{customer.email || 'Not provided'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiPhone className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Phone</div>
                  <div className="font-medium">{customer.phone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiPackage className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Product</div>
                  <div className="font-medium">{customer.productDetails || 'Not specified'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Purchase Date</div>
                  <div className="font-medium">{formatDate(customer.purchaseDate, 'long')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Notes</h2>
              <p className="text-slate-700 whitespace-pre-line">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Warranty Status */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Warranty Status</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Status</div>
                <div className="font-medium">{customer.status}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Warranty End Date</div>
                <div className="font-medium">{formatDate(customer.warrantyEndDate, 'long')}</div>
              </div>
              {!expired && (
                <div>
                  <div className="text-sm text-slate-600 mb-1">Days Remaining</div>
                  <div className={`font-bold text-lg ${
                    expiringSoon ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {warrantyDaysLeft} days
                  </div>
                </div>
              )}
              
              {expired && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    Warranty has expired. Consider requesting a review.
                  </div>
                </div>
              )}
              
              {expiringSoon && !expired && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                  <FiAlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    Warranty expiring soon. Send reminder to customer.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="btn-secondary w-full">
                Send Warranty Reminder
              </button>
              <button className="btn-secondary w-full">
                Send Review Request
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Delete Customer?</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDetailPage