import { useState, useEffect } from 'react'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'
import { uploadToCloudinary } from '../../utils/cloudinary'
import { FiUpload, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const SiteSettingsPage = () => {
  const { settings, updateSettings, loading: contextLoading } = useSiteSettings()
  const [activeTab, setActiveTab] = useState('branding')
  const [formData, setFormData] = useState(settings)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        social: {
          ...prev.branding.social,
          [platform]: value
        }
      }
    }))
  }

  const handleTemplateChange = (index, value) => {
    const newTemplates = [...(formData.contactTemplates || [])]
    newTemplates[index] = value
    setFormData(prev => ({ ...prev, contactTemplates: newTemplates }))
  }

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadToCloudinary(file, 'mitc-settings')
      handleChange(section, field, result.url)
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateSettings(formData)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Site Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'branding'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Branding
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'pages'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Pages
        </button>
        <button
          onClick={() => setActiveTab('plugins')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'plugins'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Plugins
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            {/* Logo */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Logo</h3>
              {formData.branding?.logo ? (
                <div className="relative inline-block">
                  <img src={formData.branding.logo} alt="Logo" className="h-20 w-auto" />
                  <button
                    type="button"
                    onClick={() => handleChange('branding', 'logo', '')}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="inline-flex flex-col items-center justify-center px-6 py-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-primary-500">
                  <FiUpload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600">Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'branding', 'logo')}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Store Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Store Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Slogan</label>
                  <input
                    type="text"
                    value={formData.branding?.slogan || ''}
                    onChange={(e) => handleChange('branding', 'slogan', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.branding?.phone || ''}
                    onChange={(e) => handleChange('branding', 'phone', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.branding?.email || ''}
                    onChange={(e) => handleChange('branding', 'email', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={formData.branding?.address || ''}
                    onChange={(e) => handleChange('branding', 'address', e.target.value)}
                    rows={2}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.branding?.social?.whatsapp || ''}
                    onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                    placeholder="+918082754459"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.branding?.social?.instagram || ''}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.branding?.social?.facebook || ''}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={formData.branding?.social?.youtube || ''}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Contact Templates */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Message Templates</h3>
              <p className="text-sm text-slate-600 mb-4">
                Use [Product Title] as placeholder for product name
              </p>
              <div className="space-y-3">
                {(formData.contactTemplates || []).map((template, index) => (
                  <div key={index}>
                    <label className="block text-xs font-medium mb-1">Template {index + 1}</label>
                    <input
                      type="text"
                      value={template}
                      onChange={(e) => handleTemplateChange(index, e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            {['about', 'terms', 'privacy', 'contact'].map((page) => (
              <div key={page} className="card p-6">
                <h3 className="text-lg font-semibold mb-4 capitalize">{page} Page</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.pages?.[page]?.title || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          pages: {
                            ...prev.pages,
                            [page]: {
                              ...prev.pages[page],
                              title: e.target.value
                            }
                          }
                        }))
                      }}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <textarea
                      value={formData.pages?.[page]?.content || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          pages: {
                            ...prev.pages,
                            [page]: {
                              ...prev.pages[page],
                              content: e.target.value
                            }
                          }
                        }))
                      }}
                      rows={6}
                      className="input font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Plugins Tab */}
        {activeTab === 'plugins' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Cloudinary Integration</h3>
              <p className="text-sm text-slate-600 mb-4">
                Cloudinary is configured via environment variables. Update your .env file to change settings.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32">Cloud Name:</span>
                  <span className="text-slate-600">{formData.cloudinary?.cloudName || 'Not configured'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32">Upload Preset:</span>
                  <span className="text-slate-600">{formData.cloudinary?.uploadPreset || 'Not configured'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32">Status:</span>
                  <span className="badge badge-success text-xs">
                    {formData.cloudinary?.cloudName ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Firebase Configuration</h3>
              <p className="text-sm text-slate-600 mb-4">
                Firebase is configured via environment variables and cannot be changed from here.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32">Project ID:</span>
                  <span className="text-slate-600">{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium w-32">Status:</span>
                  <span className="badge badge-success text-xs">Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SiteSettingsPage