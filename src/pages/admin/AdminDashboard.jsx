import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProductsCountByCategory } from '../../services/productService'
import { getCustomers } from '../../services/customerService'
import { getReviews } from '../../services/reviewService'
import { FiPackage, FiUsers, FiStar, FiTrendingUp } from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    newArrivals: 0,
    limitedStock: 0,
    activeCustomers: 0,
    pendingReviews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productCounts, customers, reviews] = await Promise.all([
        getProductsCountByCategory(),
        getCustomers({ status: 'Active' }),
        getReviews({ status: 'Pending' })
      ])

      setStats({
        totalProducts: productCounts.total,
        newArrivals: productCounts.newArrivals,
        limitedStock: productCounts.limitedStock,
        activeCustomers: customers.length,
        pendingReviews: reviews.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FiPackage}
          color="bg-blue-100 text-blue-600"
          link="/admin/products"
        />
        <StatCard
          title="New Arrivals"
          value={stats.newArrivals}
          icon={FiTrendingUp}
          color="bg-green-100 text-green-600"
          link="/admin/products"
        />
        <StatCard
          title="Limited Stock"
          value={stats.limitedStock}
          icon={FiPackage}
          color="bg-yellow-100 text-yellow-600"
          link="/admin/products"
        />
        <StatCard
          title="Active Warranties"
          value={stats.activeCustomers}
          icon={FiUsers}
          color="bg-purple-100 text-purple-600"
          link="/admin/customers"
        />
      </div>

      {/* Pending Reviews Alert */}
      {stats.pendingReviews > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <FiStar className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">
                {stats.pendingReviews} Pending Review{stats.pendingReviews !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-yellow-700">
                Review and moderate customer reviews
              </p>
            </div>
            <Link to="/admin/store-reviews" className="ml-auto btn-secondary text-sm">
              Review Now
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/products/new" className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="font-medium text-slate-900 mb-1">Add New Product</div>
            <div className="text-sm text-slate-600">Create a new product listing</div>
          </Link>
          <Link to="/admin/customers" className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="font-medium text-slate-900 mb-1">Manage Customers</div>
            <div className="text-sm text-slate-600">Track warranties and reviews</div>
          </Link>
          <Link to="/admin/site-settings" className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <div className="font-medium text-slate-900 mb-1">Site Settings</div>
            <div className="text-sm text-slate-600">Update branding and pages</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon: Icon, color, link }) => {
  return (
    <Link to={link} className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Link>
  )
}

export default AdminDashboard