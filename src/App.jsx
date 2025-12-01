import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Public Pages
import PublicLayout from './components/layouts/PublicLayout'
import HomePage from './pages/public/HomePage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import AboutPage from './pages/public/AboutPage'
import TermsPage from './pages/public/TermsPage'
import PrivacyPage from './pages/public/PrivacyPage'
import ContactPage from './pages/public/ContactPage'
import LoginPage from './pages/auth/LoginPage'

// Admin Pages
import AdminLayout from './components/layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import CustomersPage from './pages/admin/CustomersPage'
import CustomerDetailPage from './pages/admin/CustomerDetailPage'
import ProductsManagementPage from './pages/admin/ProductsManagementPage'
import ProductEditorPage from './pages/admin/ProductEditorPage'
import StoreReviewsPage from './pages/admin/StoreReviewsPage'
import SiteSettingsPage from './pages/admin/SiteSettingsPage'

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:customerId" element={<CustomerDetailPage />} />
        <Route path="products" element={<ProductsManagementPage />} />
        <Route path="products/new" element={<ProductEditorPage />} />
        <Route path="products/:productId/edit" element={<ProductEditorPage />} />
        <Route path="store-reviews" element={<StoreReviewsPage />} />
        <Route path="site-settings" element={<SiteSettingsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App