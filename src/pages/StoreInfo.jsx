import { FiPhone, FiMail, FiMapPin, FiClock, FiInstagram, FiFacebook } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Card from '../components/common/Card'
import storeConfig from '../config/store'
import { motion } from 'framer-motion'

const StoreInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {storeConfig.name}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {storeConfig.tagline}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <h2 className="font-display font-bold text-2xl mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <FiMapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {storeConfig.location.address}<br />
                      {storeConfig.location.landmark}<br />
                      {storeConfig.location.city}, {storeConfig.location.state}<br />
                      {storeConfig.location.country} - {storeConfig.location.pincode}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <FiPhone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a
                      href={`tel:${storeConfig.contact.phone}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {storeConfig.contact.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FaWhatsapp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${storeConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 dark:text-green-400 hover:underline"
                    >
                      {storeConfig.contact.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <FiMail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href={`mailto:${storeConfig.contact.email}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {storeConfig.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Store Hours */}
            <Card className="mt-6">
              <div className="flex items-center space-x-3 mb-6">
                <FiClock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="font-display font-bold text-2xl">
                  Store Hours
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">{storeConfig.hours.winter.label}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {storeConfig.hours.winter.open} - {storeConfig.hours.winter.close}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {storeConfig.hours.winter.days}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">{storeConfig.hours.summer.label}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {storeConfig.hours.summer.open} - {storeConfig.hours.summer.close}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {storeConfig.hours.summer.days}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Map and Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Google Maps */}
            <Card className="mb-6">
              <h2 className="font-display font-bold text-2xl mb-6">
                Location
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={storeConfig.social.mapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                />
              </div>
              <a
                href={storeConfig.social.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary w-full mt-4"
              >
                Open in Google Maps
              </a>
            </Card>

            {/* Social Media */}
            <Card>
              <h2 className="font-display font-bold text-2xl mb-6">
                Follow Us
              </h2>
              <div className="space-y-3">
                <a
                  href={storeConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <FiInstagram className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Instagram</p>
                    <p className="text-sm opacity-90">@mitc.usedlaptops</p>
                  </div>
                </a>

                <a
                  href={storeConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <FiFacebook className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Facebook</p>
                    <p className="text-sm opacity-90">Visit our page</p>
                  </div>
                </a>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <h2 className="font-display font-bold text-2xl mb-6">About Us</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              {storeConfig.about.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {storeConfig.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center"
                >
                  <p className="font-medium text-primary-900 dark:text-primary-100">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default StoreInfo
