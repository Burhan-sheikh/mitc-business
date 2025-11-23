import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Loading from '../common/Loading'

const AdminRoute = ({ children }) => {
  const { currentUser, userData, loading } = useAuth()

  if (loading) {
    return <Loading fullScreen />
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You don't have permission to access this area.
          </p>
          <a href="/" className="btn btn-primary">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default AdminRoute
