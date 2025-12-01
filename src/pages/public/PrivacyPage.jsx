import { useSiteSettings } from '../../contexts/SiteSettingsContext'

const PrivacyPage = () => {
  const { settings, loading } = useSiteSettings()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const privacyContent = settings.pages?.privacy

  return (
    <div className="container-custom section-padding">
      {privacyContent?.featuredImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={privacyContent.featuredImage}
            alt={privacyContent.title || 'Privacy Policy'}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{privacyContent?.title || 'Privacy Policy'}</h1>
        
        <div className="prose prose-lg max-w-none">
          {privacyContent?.content ? (
            <div dangerouslySetInnerHTML={{ __html: privacyContent.content }} />
          ) : (
            <div>
              <p className="text-slate-600 mb-6">Last updated: December 1, 2025</p>

              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-6">
                Mateen IT Corp ("MITC", "we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services.
              </p>

              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="mb-4"><strong>Personal Information:</strong></p>
              <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Create an account on our website</li>
                <li>Contact us via phone, email, WhatsApp, or social media</li>
                <li>Make a purchase in our showroom</li>
                <li>Subscribe to our newsletter or notifications</li>
                <li>Participate in our warranty program</li>
              </ul>
              <p className="mb-6">
                This information may include: name, email address, phone number, and product purchase details.
              </p>

              <p className="mb-4"><strong>Automatically Collected Information:</strong></p>
              <p className="mb-6">
                When you visit our website, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and cookies installed on your device. This information is used to improve our website and services.
              </p>

              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Process and manage your inquiries and purchases</li>
                <li>Send you warranty reminders and notifications</li>
                <li>Request reviews and feedback on your purchase experience</li>
                <li>Improve our website, products, and services</li>
                <li>Communicate with you about products, services, and promotions</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p className="mb-6">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and conducting our business (e.g., Firebase for authentication and database services, Cloudinary for image hosting)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="mb-6">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your personal information</li>
              </ul>
              <p className="mb-6">
                To exercise any of these rights, please contact us using the contact information provided below.
              </p>

              <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="mb-6">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are small data files that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
              <p className="mb-6">
                Our website may contain links to third-party websites (such as WhatsApp, Instagram, Facebook). We are not responsible for the privacy practices or content of these third-party sites. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>

              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="mb-6">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>

              <h2 className="text-2xl font-semibold mb-4">10. Data Retention</h2>
              <p className="mb-6">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>

              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <p className="mb-2"><strong>Mateen IT Corp</strong></p>
              <p className="mb-2">Maisuma, Near Gaw Kadal Bridge</p>
              <p className="mb-2">Srinagar, Kashmir - 190001</p>
              <p className="mb-2">Phone: +91 8082754459</p>
              <p className="mb-2">WhatsApp: +91 8082754459</p>
              <p className="mb-2">Email: mateencorp@gmail.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage