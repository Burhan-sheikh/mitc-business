import { useState, useEffect } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { debounce } from '../../utils/helpers'

const SearchBar = ({ onSearch, placeholder = 'Search products...' }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onSearch(searchTerm)
    }, 300)

    debouncedSearch()
  }, [searchTerm, onSearch])

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 input"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Clear search"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
