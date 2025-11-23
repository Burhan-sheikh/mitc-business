import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => (
  <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
    <Sidebar />
    <main className="flex-1 overflow-auto p-8">
      <Outlet />
    </main>
  </div>
)

export default AdminLayout
