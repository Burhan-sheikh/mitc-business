import { useSiteSettings } from '../../contexts/SiteSettingsContext'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaFacebook, FaClock } from 'react-icons/fa'

const ContactPage = () => {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const { branding, pages } = settings
  const contactInfo = pages?.contact

  return (
    <div className="container-custom section-padding">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-lg text-slate-600 mb-12 text-center">
          Get in touch with us for any queries about our laptops and services
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
                    <FaPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Phone</div>
                    <a href={`tel:${branding?.phone}`} className="text-slate-600 hover:text-primary-600">
                      {branding?.phone || '+91 8082754459'}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                {branding?.social?.whatsapp && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                      <FaWhatsapp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">WhatsApp</div>
                      <a
                        href={`https://wa.me/${branding.social.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-green-600"
                      >
                        {branding.social.whatsapp}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Email</div>
                    <a href={`mailto:${branding?.email}`} className="text-slate-600 hover:text-primary-600">
                      {branding?.email || 'mateencorp@gmail.com'}
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-lg text-red-600">
                    <FaMapMarkerAlt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Location</div>
                    <p className="text-slate-600">
                      {contactInfo?.location || branding?.address || 'Maisuma, Near Gaw Kadal Bridge, Srinagar, Kashmir - 190001'}
                    </p>
                  </div>
                </div>

                {/* Store Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Store Hours</div>
                    <p className="text-slate-600">
                      <strong>Winter (Oct-Mar):</strong> 10:30 AM - 6:00 PM<br />
                      <strong>Summer (Apr-Sep):</strong> 8:00 AM - 9:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                {branding?.social?.whatsapp && (
                  <a
                    href={`https://wa.me/${branding.social.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    WhatsApp
                  </a>
                )}
                {branding?.social?.instagram && (
                  <a
                    href={branding.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                  >
                    <FaInstagram className="w-5 h-5" />
                    Instagram
                  </a>
                )}
                {branding?.social?.facebook && (
                  <a
                    href={branding.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FaFacebook className="w-5 h-5" />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="card overflow-hidden">
            {contactInfo?.mapEmbedUrl ? (
              <iframe
                src={contactInfo.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MITC Location"
              />
            ) : (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3175.749545702667!2d74.809277!3d34.073485999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDA0JzI0LjYiTiA3NMKwNDgnMzMuNCJF!5e1!3m2!1sen!2sin!4v1763885843371!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MITC Location"
              />
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-3">Visit Our Showroom</h3>
          <p className="text-slate-700 mb-4">
            We recommend visiting our showroom to see our laptop collection in person and get expert guidance from our team.
          </p>
          <p className="text-sm text-slate-600">
            <strong>Note:</strong> We offer in-store purchases only. All laptops come with a 15-day testing warranty.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactPage