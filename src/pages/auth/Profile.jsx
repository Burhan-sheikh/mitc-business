import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FiUser, FiMail, FiCalendar, FiShield, FiLogOut, FiTrash2 } from 'react-icons/fi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { currentUser, userData, signOut, requestAccountDeletion } = useAuth()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const handleDeleteRequest = async () => {
    setDeleting(true)
    try {
      await requestAccountDeletion()
      setShowDeleteConfirm(false)
      toast.success('Deletion request submitted. An admin will review it.')
    } catch (error) {
      toast.error('Failed to request account deletion')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h2 className="font-display font-semibold text-lg mb-6">
              Account Information
            </h2>

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                {userData?.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.displayName}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {userData?.displayName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {userData?.displayName || 'User'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userData?.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p>{currentUser?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Display Name</p>
                    <p>{userData?.displayName || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <FiShield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                    <p className="capitalize">{userData?.role || 'user'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                    <p>{formatDate(userData?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Deletion Request Status */}
          {userData?.deletionRequested && (
            <Card className="border-red-200 dark:border-red-800">
              <div className="flex items-start space-x-3">
                <FiTrash2 className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">
                    Account Deletion Requested
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your account deletion request is pending review by an administrator.
                    Requested on {formatDate(userData?.deletionRequestedAt)}.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                icon={<FiLogOut />}
                onClick={handleSignOut}
              >
                Sign Out
              </Button>

              {!userData?.deletionRequested && (
                <Button
                  variant="danger"
                  fullWidth
                  icon={<FiTrash2 />}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              )}
            </div>
          </Card>

          {/* Admin Badge */}
          {userData?.role === 'admin' && (
            <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <div className="text-center">
                <FiShield className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                  Administrator
                </h3>
                <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                  You have admin privileges
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-md w-full">
            <h3 className="font-display font-bold text-xl mb-4 text-red-600 dark:text-red-400">
              Delete Account?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will request your account to be deleted. An administrator will review
              your request. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleDeleteRequest}
                loading={deleting}
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Profile
