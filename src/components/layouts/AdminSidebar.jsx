import { NavLink } from 'react-router-dom'
import { 
  FiGrid, 
  FiUsers, 
  FiPackage, 
  FiStar, 
  FiSettings,
  FiHome
} from 'react-icons/fi'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'

const AdminSidebar = () => {
  const { settings } = useSiteSettings()

  const navItems = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
    { to: '/admin/customers', icon: FiUsers, label: 'Customers' },
    { to: '/admin/products', icon: FiPackage, label: 'Products' },
    { to: '/admin/store-reviews', icon: FiStar, label: 'Store Reviews' },
    { to: '/admin/site-settings', icon: FiSettings, label: 'Site Settings' },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {settings.branding?.logo ? (
            <img src={settings.branding.logo} alt="MITC" className="h-8 w-auto" />
          ) : (
            <div className="text-2xl font-bold text-primary-400">MITC</div>
          )}
          <div>
            <div className="font-semibold">Mateen IT Corp</div>
            <div className="text-xs text-slate-400">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {/* Back to Site */}
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <FiHome className="w-5 h-5" />
          <span>Back to Site</span>
        </a>

        <div className="my-4 border-t border-slate-800" />

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} MITC
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar