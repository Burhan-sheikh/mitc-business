import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'
import { debounce } from '../../utils/helpers'

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { currentUser, logout, isAdmin } = useAuth()
  const { settings } = useSiteSettings()
  const navigate = useNavigate()

  const handleSearch = debounce((query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }, 500)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="py-3 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            {settings.branding?.logo ? (
              <img
                src={settings.branding.logo}
                alt="MITC"
                className="h-10 w-auto"
              />
            ) : (
              <div className="text-2xl font-bold text-primary-600">MITC</div>
            )}
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-slate-900 whitespace-nowrap">Mateen IT Corp</div>
              <div className="text-xs text-slate-600 whitespace-nowrap">{settings.branding?.slogan || 'Premium Laptops in Kashmir'}</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search laptops by brand, model, or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle search"
            >
              <FiSearch className="w-5 h-5 text-slate-700" />
            </button>

            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <FiLogOut className="w-5 h-5 text-slate-700" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Login"
                aria-label="Login"
              >
                <FiUser className="w-5 h-5 text-slate-700" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-slate-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search laptops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  autoFocus
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </form>
          </div>
        )}

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-6 pb-3 border-t pt-3">
          <Link to="/" className="text-slate-700 hover:text-primary-600 font-medium text-sm transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-slate-700 hover:text-primary-600 font-medium text-sm transition-colors">
            Products
          </Link>
          <Link to="/about" className="text-slate-700 hover:text-primary-600 font-medium text-sm transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-slate-700 hover:text-primary-600 font-medium text-sm transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors"
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-700 font-medium transition-colors sm:hidden"
              >
                Admin Panel
              </Link>
            )}
            <Link
              to="/terms"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors"
            >
              Privacy
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default PublicHeader