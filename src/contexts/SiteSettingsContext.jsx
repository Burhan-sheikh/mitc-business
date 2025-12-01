import { createContext, useContext, useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import toast from 'react-hot-toast'

const SiteSettingsContext = createContext({})

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  }
  return context
}

// Default settings for MITC
const defaultSettings = {
  branding: {
    logo: '',
    slogan: 'Premium Laptops in Kashmir',
    phone: '+91 8082754459',
    address: 'Maisuma, Near Gaw Kadal Bridge, Srinagar, Kashmir - 190001',
    email: 'mateencorp@gmail.com',
    social: {
      whatsapp: '+918082754459',
      instagram: 'https://www.instagram.com/mitc.usedlaptops',
      facebook: 'https://www.facebook.com/profile.php?id=100090625847838',
      youtube: '',
    }
  },
  pages: {
    about: {
      title: 'About MITC',
      content: 'Mateen IT Corp is Kashmir\'s premier laptop showroom, offering quality laptops with a 15-day testing warranty.',
      featuredImage: ''
    },
    terms: {
      title: 'Terms and Conditions',
      content: 'Terms and conditions content here.',
      featuredImage: ''
    },
    privacy: {
      title: 'Privacy Policy',
      content: 'Privacy policy content here.',
      featuredImage: ''
    },
    contact: {
      title: 'Contact Us',
      content: 'Get in touch with us for any queries.',
      phone: '+91 8082754459',
      email: 'mateencorp@gmail.com',
      location: 'Maisuma, Near Gaw Kadal Bridge, Srinagar, Kashmir',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3175.749545702667!2d74.809277!3d34.073485999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDA0JzI0LjYiTiA3NMKwNDgnMzMuNCJF!5e1!3m2!1sen!2sin!4v1763885843371!5m2!1sen!2sin'
    }
  },
  contactTemplates: [
    'Hi, I\'m interested in [Product Title]. Is it available?',
    'Can I get more details about [Product Title]?',
    'What is the warranty on [Product Title]?',
    'Can I visit the store to see [Product Title]?',
    'Is [Product Title] available for immediate purchase?',
    'What are the payment options for [Product Title]?',
    'Can you help me choose between similar models?',
    'Do you have any ongoing deals on [Product Title]?',
    'What accessories come with [Product Title]?',
    'Can I get a discount on [Product Title]?'
  ],
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || ''
  }
}

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)

  // Fetch settings from Firestore
  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'siteSettings', 'main'))
      if (settingsDoc.exists()) {
        setSettings({ ...defaultSettings, ...settingsDoc.data() })
      } else {
        // Create default settings if they don't exist
        await setDoc(doc(db, 'siteSettings', 'main'), defaultSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load site settings')
    } finally {
      setLoading(false)
    }
  }

  // Update settings
  const updateSettings = async (newSettings) => {
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), newSettings, { merge: true })
      setSettings({ ...settings, ...newSettings })
      toast.success('Settings updated successfully')
      return true
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
      return false
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const value = {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  }

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  )
}