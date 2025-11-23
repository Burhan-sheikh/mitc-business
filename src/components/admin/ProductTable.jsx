// ProductTable.jsx
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>
  }
  if (!products || products.length === 0) {
    return <div className="py-8 text-center text-gray-500 dark:text-gray-400">No products found.</div>
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Brand</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-right">Price</th>
            <th className="px-4 py-2 text-center">Stock</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2 whitespace-nowrap max-w-xs truncate">{product.title}</td>
              <td className="px-4 py-2">{product.brand}</td>
              <td className="px-4 py-2">{product.category}</td>
              <td className="px-4 py-2 text-right">
                ₹{product.price.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center">
                {product.inStock ? '✅' : '❌'}
              </td>
              <td className="px-4 py-2 text-center">
                <button onClick={() => onEdit(product)} className="inline-flex items-center text-primary-600 hover:underline mr-2"><FiEdit2 /></button>
                <button onClick={() => onDelete(product.id)} className="inline-flex items-center text-red-600 hover:underline"><FiTrash2 /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default ProductTable
