import { useSiteSettings } from '../../contexts/SiteSettingsContext'

const TermsPage = () => {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const termsContent = settings.pages?.terms

  return (
    <div className="container-custom section-padding">
      {termsContent?.featuredImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={termsContent.featuredImage}
            alt={termsContent.title || 'Terms and Conditions'}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{termsContent?.title || 'Terms and Conditions'}</h1>
        
        <div className="prose prose-lg max-w-none">
          {termsContent?.content ? (
            <div dangerouslySetInnerHTML={{ __html: termsContent.content }} />
          ) : (
            <div>
              <p className="text-slate-600 mb-6">Last updated: December 1, 2025</p>

              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using the MITC website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold mb-4">2. Product Information</h2>
              <p className="mb-6">
                We strive to provide accurate product information on our website. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, or error-free. All laptops are subject to prior sale.
              </p>

              <h2 className="text-2xl font-semibold mb-4">3. 15-Day Testing Warranty</h2>
              <p className="mb-4">
                All laptops purchased from MITC come with a 15-day testing warranty from the date of purchase. This warranty covers:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Hardware defects that existed at the time of purchase</li>
                <li>Functionality issues discovered during normal use</li>
                <li>Manufacturing defects not caused by user mishandling</li>
              </ul>
              <p className="mb-6">
                The warranty does not cover damage caused by:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Physical damage, liquid spills, or drops</li>
                <li>Software modifications or installations</li>
                <li>Normal wear and tear</li>
                <li>Unauthorized repairs or modifications</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">4. In-Store Purchase Only</h2>
              <p className="mb-6">
                MITC does not offer online ordering or payment. All purchases must be made in person at our showroom in Maisuma, Srinagar. The website is for browsing and information purposes only.
              </p>

              <h2 className="text-2xl font-semibold mb-4">5. Pricing</h2>
              <p className="mb-6">
                All prices displayed are in Indian Rupees (₹) and are subject to change without notice. Final pricing will be confirmed at the time of purchase in store.
              </p>

              <h2 className="text-2xl font-semibold mb-4">6. Stock Availability</h2>
              <p className="mb-6">
                Product availability displayed on the website is updated regularly but may not reflect real-time stock levels. We recommend contacting us or visiting our showroom to confirm availability before making a trip.
              </p>

              <h2 className="text-2xl font-semibold mb-4">7. Returns and Exchanges</h2>
              <p className="mb-6">
                Within the 15-day testing warranty period, defective products may be returned or exchanged subject to verification by our technical team. Products must be returned in original condition with all accessories and packaging.
              </p>

              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="mb-6">
                MITC shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our products or services.
              </p>

              <h2 className="text-2xl font-semibold mb-4">9. Privacy</h2>
              <p className="mb-6">
                Your use of MITC's website and services is also governed by our Privacy Policy. Please review our Privacy Policy for information on how we collect, use, and protect your personal information.
              </p>

              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="mb-6">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following the posting of changes constitutes acceptance of those changes.
              </p>

              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p className="mb-6">
                These terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Srinagar, Jammu and Kashmir.
              </p>

              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <p className="mb-2"><strong>Mateen IT Corp</strong></p>
              <p className="mb-2">Maisuma, Near Gaw Kadal Bridge</p>
              <p className="mb-2">Srinagar, Kashmir - 190001</p>
              <p className="mb-2">Phone: +91 8082754459</p>
              <p className="mb-2">Email: mateencorp@gmail.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TermsPage