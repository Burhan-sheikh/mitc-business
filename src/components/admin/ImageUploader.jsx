// ImageUploader.jsx
import { useRef, useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi'

const ImageUploader = ({ onUpload, disabled }) => {
  const inputRef = useRef()
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e) => {
    if (!e.target.files?.length) return
    const file = e.target.files[0]
    setFileName(file.name)
    setUploading(true)
    await onUpload(file)
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center border-2 border-dashed border-primary-500 p-6 rounded-lg">
      <button
        type="button"
        className="flex items-center space-x-2 text-primary-600 font-medium py-2 px-4 rounded-lg bg-primary-50 hover:bg-primary-100"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
      >
        <FiUploadCloud className="w-6 h-6" />
        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
      </button>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
        disabled={disabled || uploading}
      />
      {fileName && <div className="mt-2 text-xs text-gray-500">Selected: {fileName}</div>}
    </div>
  )
}
export default ImageUploader
