import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
      <div className="flex space-x-1">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
        />
      </div>
      <span className="text-xs">Someone is typing...</span>
    </div>
  )
}

export default TypingIndicator
