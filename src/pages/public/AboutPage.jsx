import { useSiteSettings } from '../../contexts/SiteSettingsContext'

const AboutPage = () => {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const aboutContent = settings.pages?.about

  return (
    <div className="container-custom section-padding">
      {aboutContent?.featuredImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={aboutContent.featuredImage}
            alt={aboutContent.title || 'About Us'}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{aboutContent?.title || 'About Us'}</h1>
        
        <div className="prose prose-lg max-w-none">
          {aboutContent?.content ? (
            <div dangerouslySetInnerHTML={{ __html: aboutContent.content }} />
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Welcome to Mateen IT Corp</h2>
              <p className="mb-4">
                Mateen IT Corp (MITC) is Kashmir's premier destination for quality laptops. Located in Maisuma, Srinagar, near Gaw Kadal Bridge, we specialize in providing premium, standard, and basic laptops with a 15-day testing warranty.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-8">Our Mission</h3>
              <p className="mb-4">
                We are committed to making quality technology accessible to everyone in Kashmir. Whether you're a student, professional, or business owner, we have the perfect laptop solution for your needs.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-8">Why Choose MITC?</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>15-Day Testing Warranty</strong> - Try before you commit</li>
                <li><strong>Quality Assurance</strong> - Every laptop is thoroughly tested</li>
                <li><strong>Expert Guidance</strong> - Our team helps you find the right fit</li>
                <li><strong>Competitive Pricing</strong> - Best value for your investment</li>
                <li><strong>Local Support</strong> - We're here for you in Srinagar</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-8">Our Inventory</h3>
              <p className="mb-4">
                We maintain a carefully curated selection of 10-50 laptops at any given time, representing 2-6 different models. This allows us to focus on quality over quantity and ensure each device meets our strict standards.
              </p>

              <p className="mb-4">
                For bulk orders, we can import and test your required laptops within 6-12 days, plus an additional 2-5 days for thorough testing to ensure perfect condition.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-8">Visit Our Showroom</h3>
              <p className="mb-4">
                <strong>Location:</strong> Maisuma, Near Gaw Kadal Bridge, Srinagar, Kashmir - 190001<br />
                <strong>Winter Hours (Oct-Mar):</strong> 10:30 AM - 6:00 PM<br />
                <strong>Summer Hours (Apr-Sep):</strong> 8:00 AM - 9:00 PM<br />
                <strong>Phone:</strong> +91 8082754459<br />
                <strong>WhatsApp:</strong> +91 8082754459
              </p>

              <p className="text-lg font-medium mt-8">
                We look forward to helping you find your perfect laptop!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AboutPage