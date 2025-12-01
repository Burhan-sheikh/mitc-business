import { Outlet } from 'react-router-dom'
import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'
import { SiteSettingsProvider } from '../../contexts/SiteSettingsContext'

const PublicLayout = () => {
  return (
    <SiteSettingsProvider>
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-grow">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    </SiteSettingsProvider>
  )
}

export default PublicLayout