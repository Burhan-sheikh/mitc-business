import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'

const PublicFooter = () => {
  const { settings } = useSiteSettings()
  const { branding } = settings

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Mateen IT Corp</h3>
            <p className="text-sm text-slate-400 mb-4">
              {branding?.slogan || 'Premium Laptops in Kashmir'}
            </p>
            <p className="text-sm text-slate-400">
              Your trusted destination for quality laptops with 15-day testing warranty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              {branding?.phone && (
                <li className="flex items-center gap-2">
                  <FaPhone className="text-primary-400" />
                  <a href={`tel:${branding.phone}`} className="hover:text-primary-400">
                    {branding.phone}
                  </a>
                </li>
              )}
              {branding?.email && (
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-primary-400" />
                  <a href={`mailto:${branding.email}`} className="hover:text-primary-400">
                    {branding.email}
                  </a>
                </li>
              )}
              {branding?.address && (
                <li className="text-slate-400">
                  {branding.address}
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {branding?.social?.whatsapp && (
                <a
                  href={`https://wa.me/${branding.social.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-primary-500 rounded-lg transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
              )}
              {branding?.social?.instagram && (
                <a
                  href={branding.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-primary-500 rounded-lg transition-colors"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              )}
              {branding?.social?.facebook && (
                <a
                  href={branding.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-primary-500 rounded-lg transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
              )}
              {branding?.social?.youtube && (
                <a
                  href={branding.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-primary-500 rounded-lg transition-colors"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} Mateen IT Corp. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-primary-400">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-primary-400">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter