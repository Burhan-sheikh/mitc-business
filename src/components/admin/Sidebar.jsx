import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiPackage, FiUsers, FiMessageCircle, FiStar, FiSettings, FiFilePlus } from 'react-icons/fi'
import storeConfig from '../../config/store'

const links = [
  { to: '/admin', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/chats', icon: FiMessageCircle, label: 'Chats' },
  { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
  { to: '/admin/import-export', icon: FiFilePlus, label: 'Import/Export' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
]

const Sidebar = () => {
  const { pathname } = useLocation()
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="h-16 flex items-center justify-center font-display font-bold text-xl tracking-wide border-b border-gray-800">
        {storeConfig.shortName || 'MITC'} <span className="ml-2 text-xs font-medium bg-primary-500 text-white py-0.5 px-2 rounded">Admin</span>
      </div>
      <nav className="flex-1 mt-6">
        <ul className="space-y-1 px-3">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={label}>
              <Link
                to={to}
                className={`flex items-center space-x-3 rounded-lg py-2 px-3 hover:bg-primary-700 transition ${pathname === to ? 'bg-primary-700/80 font-semibold' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="text-center py-4 px-3 text-xs text-gray-400 border-t border-gray-800">
        &copy; {new Date().getFullYear()} {storeConfig.shortName || 'MITC'}
      </div>
    </aside>
  )
}

export default Sidebar
