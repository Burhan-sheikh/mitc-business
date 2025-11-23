import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ChatProvider } from './contexts/ChatContext'

// Layout Components
import Layout from './components/common/Layout'
import AdminLayout from './components/admin/AdminLayout'

// Pages
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import StoreInfo from './pages/StoreInfo'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/auth/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import ProductEditor from './pages/admin/ProductEditor'
import ChatModeration from './pages/admin/ChatModeration'
import UserManagement from './pages/admin/UserManagement'
import ReviewModeration from './pages/admin/ReviewModeration'
import ImportExport from './pages/admin/ImportExport'
import Settings from './pages/admin/Settings'

// Route Guards
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ChatProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a202c',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="store-info" element={<StoreInfo />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/new" element={<ProductEditor />} />
                <Route path="products/edit/:id" element={<ProductEditor />} />
                <Route path="chats" element={<ChatModeration />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reviews" element={<ReviewModeration />} />
                <Route path="import-export" element={<ImportExport />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </ChatProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
