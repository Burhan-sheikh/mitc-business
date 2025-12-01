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
      <div className="container-custom">
        {/* Top Bar */}
        <div className="py-3 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <Link to="/" className="flex items-center gap-3">
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
              <div className="text-sm font-medium text-slate-900">Mateen IT Corp</div>
              <div className="text-xs text-slate-600">{settings.branding?.slogan}</div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search laptops by brand, model, or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex btn-secondary text-sm"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-slate-100 rounded-lg">
                <FiUser className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </form>
          </div>
        )}

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-6 pb-3 border-t pt-3">
          <Link to="/" className="text-slate-700 hover:text-primary-600 font-medium">
            Home
          </Link>
          <Link to="/products" className="text-slate-700 hover:text-primary-600 font-medium">
            Products
          </Link>
          <Link to="/about" className="text-slate-700 hover:text-primary-600 font-medium">
            About
          </Link>
          <Link to="/contact" className="text-slate-700 hover:text-primary-600 font-medium">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg"
            >
              Products
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg"
            >
              Contact
            </Link>
            <Link
              to="/terms"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-50 rounded-lg"
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