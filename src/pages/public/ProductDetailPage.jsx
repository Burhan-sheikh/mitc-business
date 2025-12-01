import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, getRelatedProducts } from '../../services/productService'
import { formatCurrency, getStockStatus } from '../../utils/helpers'
import { useSiteSettings } from '../../contexts/SiteSettingsContext'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram, FaFacebook, FaEnvelope } from 'react-icons/fa'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { productId } = useParams()
  const { settings } = useSiteSettings()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(0)

  useEffect(() => {
    fetchProductData()
  }, [productId])

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const [productData, related] = await Promise.all([
        getProduct(productId),
        getRelatedProducts(productId, 8)
      ])
      setProduct(productData)
      setRelatedProducts(related)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (product?.galleryImages) {
      setCurrentImageIndex((prev) => (prev + 1) % product.galleryImages.length)
    }
  }

  const prevImage = () => {
    if (product?.galleryImages) {
      setCurrentImageIndex((prev) => (prev - 1 + product.galleryImages.length) % product.galleryImages.length)
    }
  }

  const getMessageTemplate = (template) => {
    return template.replace('[Product Title]', product?.title || '')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.featuredImage]

  const stockStatus = getStockStatus(product.stockCount, product.isLimitedStock)

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-slate-50 py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-600 hover:text-primary-600">Home</Link>
            <span className="text-slate-400">/</span>
            <Link to="/products" className="text-slate-600 hover:text-primary-600">Products</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">{product.brand}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden mb-4">
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex gap-2 mb-3">
              {product.isNewArrival && <span className="badge badge-primary">NEW</span>}
              {product.isDeal && <span className="badge badge-accent">DEAL</span>}
              {product.isLimitedStock && <span className="badge badge-warning">LIMITED</span>}
            </div>

            <div className="text-sm text-slate-600 mb-2">{product.brand}</div>
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
            <p className="text-lg text-slate-600 mb-6">{product.shortSlogan}</p>

            <div className="text-4xl font-bold text-primary-600 mb-6">{formatCurrency(product.price)}</div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Condition:</span>
                <span className="font-medium">{product.condition}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Stock:</span>
                <span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(true)}
              className="btn-primary w-full mb-4"
              disabled={product.stockCount === 0}
            >
              {product.stockCount === 0 ? 'Out of Stock' : 'Contact Store'}
            </button>

            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
              <p><strong>Note:</strong> This is for in-store purchase only. Visit our showroom or contact us for availability and details.</p>
              <p className="mt-2"><strong>15-Day Testing Warranty</strong> included on all laptops.</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="card">
            <div className="divide-y divide-slate-200">
              <div className="grid grid-cols-2 p-4">
                <div className="text-slate-600">Brand</div>
                <div className="font-medium">{product.brand}</div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-slate-600">Model</div>
                <div className="font-medium">{product.model}</div>
              </div>
              {product.ram && (
                <div className="grid grid-cols-2 p-4">
                  <div className="text-slate-600">RAM</div>
                  <div className="font-medium">{product.ram}</div>
                </div>
              )}
              {product.cpu && (
                <div className="grid grid-cols-2 p-4">
                  <div className="text-slate-600">Processor</div>
                  <div className="font-medium">{product.cpu}</div>
                </div>
              )}
              {product.gpu && (
                <div className="grid grid-cols-2 p-4">
                  <div className="text-slate-600">Graphics</div>
                  <div className="font-medium">{product.gpu}</div>
                </div>
              )}
              {product.storage && (
                <div className="grid grid-cols-2 p-4">
                  <div className="text-slate-600">Storage</div>
                  <div className="font-medium">{product.storage}</div>
                </div>
              )}
              {product.color && (
                <div className="grid grid-cols-2 p-4">
                  <div className="text-slate-600">Color</div>
                  <div className="font-medium">{product.color}</div>
                </div>
              )}
              <div className="grid grid-cols-2 p-4">
                <div className="text-slate-600">Condition</div>
                <div className="font-medium">{product.condition}</div>
              </div>
              <div className="grid grid-cols-2 p-4">
                <div className="text-slate-600">Available Stock</div>
                <div className="font-medium">{product.stockCount} units</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Description</h2>
            <div className="card p-6">
              <p className="text-slate-700 whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <Link key={related.id} to={`/products/${related.id}`} className="card hover:shadow-lg transition-shadow group">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={related.featuredImage}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-slate-600 mb-1">{related.brand}</div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{related.title}</h3>
                    <div className="text-lg font-bold text-primary-600">{formatCurrency(related.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Contact Store</h3>
              <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-6">Choose how you'd like to contact us about <strong>{product.title}</strong></p>

              {/* Message Templates */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select a message template:</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(Number(e.target.value))}
                  className="input"
                >
                  {settings.contactTemplates?.map((template, index) => (
                    <option key={index} value={index}>
                      {getMessageTemplate(template)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                {settings.branding?.social?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.branding.social.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getMessageTemplate(settings.contactTemplates[selectedTemplate]))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <FaWhatsapp className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-sm text-slate-600">{settings.branding.social.whatsapp}</div>
                    </div>
                  </a>
                )}

                {settings.branding?.social?.instagram && (
                  <a
                    href={settings.branding.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
                  >
                    <FaInstagram className="w-6 h-6 text-pink-600" />
                    <div>
                      <div className="font-medium">Instagram</div>
                      <div className="text-sm text-slate-600">Send us a DM</div>
                    </div>
                  </a>
                )}

                {settings.branding?.social?.facebook && (
                  <a
                    href={settings.branding.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <FaFacebook className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium">Facebook</div>
                      <div className="text-sm text-slate-600">Message us</div>
                    </div>
                  </a>
                )}

                {settings.branding?.email && (
                  <a
                    href={`mailto:${settings.branding.email}?subject=Inquiry about ${product.title}&body=${encodeURIComponent(getMessageTemplate(settings.contactTemplates[selectedTemplate]))}`}
                    className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <FaEnvelope className="w-6 h-6 text-primary-600" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-slate-600">{settings.branding.email}</div>
                    </div>
                  </a>
                )}
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
                <p><strong>Store Hours:</strong></p>
                <p>Winter: 10:30 AM - 6:00 PM</p>
                <p>Summer: 8:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage