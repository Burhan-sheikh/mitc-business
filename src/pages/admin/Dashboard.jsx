import React, { useEffect, useState } from 'react'
import Card from '../../components/common/Card'
import { getProducts } from '../../services/productService'
import { getUsers } from '../../services/userService'
import { getAllReviews } from '../../services/reviewService'

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, users: 0, reviews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)

      const products = await getProducts()
      const users = await getUsers()
      const reviews = await getAllReviews()

      setStats({
        products: products?.length || products.products?.length || 0,
        users: users?.length || users.users?.length || 0,
        reviews: reviews?.length || 0,
      })

      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="text-center">
        <h2 className="text-2xl font-bold text-primary-600 mb-2">{stats.products}</h2>
        <p className="text-gray-700">Products</p>
      </Card>
      <Card className="text-center">
        <h2 className="text-2xl font-bold text-primary-600 mb-2">{stats.users}</h2>
        <p className="text-gray-700">Users</p>
      </Card>
      <Card className="text-center">
        <h2 className="text-2xl font-bold text-primary-600 mb-2">{stats.reviews}</h2>
        <p className="text-gray-700">Reviews</p>
      </Card>
    </div>
  )
}

export default Dashboard
