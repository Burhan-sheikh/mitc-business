import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const AdminHeader = () => {
  const { currentUser, logout } = useAuth()

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
        
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products/new"
            className="btn-primary text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </Link>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">
                {currentUser?.displayName || currentUser?.email}
              </div>
              <div className="text-xs text-slate-600">Administrator</div>
            </div>
            <button
              onClick={logout}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader