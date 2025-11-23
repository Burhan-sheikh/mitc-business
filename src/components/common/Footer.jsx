import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import storeConfig from '../../config/store'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-4">
              {storeConfig.name}
            </h3>
            <p className="text-sm mb-4">
              {storeConfig.tagline}
            </p>
            <div className="flex space-x-4">
              <a
                href={storeConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href={storeConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/store-info" className="hover:text-primary-400 transition-colors">
                  Store Info
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <FiMapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>
                  {storeConfig.location.address}, {storeConfig.location.city}<br />
                  {storeConfig.location.state} - {storeConfig.location.pincode}
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`tel:${storeConfig.contact.phone}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {storeConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`mailto:${storeConfig.contact.email}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {storeConfig.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Store Hours</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-white font-medium">{storeConfig.hours.winter.label}</p>
                <p>{storeConfig.hours.winter.open} - {storeConfig.hours.winter.close}</p>
                <p className="text-xs text-gray-400">{storeConfig.hours.winter.days}</p>
              </div>
              <div>
                <p className="text-white font-medium">{storeConfig.hours.summer.label}</p>
                <p>{storeConfig.hours.summer.open} - {storeConfig.hours.summer.close}</p>
                <p className="text-xs text-gray-400">{storeConfig.hours.summer.days}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>
            &copy; {currentYear} {storeConfig.name}. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Built with ❤️ for Kashmir
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
