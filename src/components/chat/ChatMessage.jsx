import { formatRelativeTime } from '../../utils/helpers'
import { motion } from 'framer-motion'

const ChatMessage = ({ message, isOwn }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {message.userName}
          </p>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <p className="text-sm">{message.message}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatRelativeTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}

export default ChatMessage
