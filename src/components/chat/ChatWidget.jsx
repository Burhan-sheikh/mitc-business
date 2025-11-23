import { useState, useEffect, useRef } from 'react'
import { FiSend, FiMessageCircle, FiX, FiMinimize2 } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../../contexts/ChatContext'
import { useAuth } from '../../contexts/AuthContext'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import toast from 'react-hot-toast'

const ChatWidget = ({ productId }) => {
  const { currentUser, userData } = useAuth()
  const { sendMessage, subscribeToChat, subscribeToTyping, updateTypingStatus } = useChat()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState({})
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Subscribe to chat messages
  useEffect(() => {
    if (!productId) return

    const unsubscribeChat = subscribeToChat(productId, (msgs) => {
      setMessages(msgs)
    })

    const unsubscribeTyping = subscribeToTyping(productId, (typing) => {
      setTypingUsers(typing)
    })

    return () => {
      unsubscribeChat()
      unsubscribeTyping()
    }
  }, [productId, subscribeToChat, subscribeToTyping])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleTyping = (e) => {
    setMessage(e.target.value)

    if (!currentUser) return

    // Update typing status
    updateTypingStatus(productId, true)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(productId, false)
    }, 2000)
  }

  const handleSend = async (e) => {
    e.preventDefault()

    if (!message.trim() || sending) return

    if (!currentUser) {
      toast.error('Please login to send messages')
      return
    }

    setSending(true)
    try {
      await sendMessage(productId, message)
      setMessage('')
      updateTypingStatus(productId, false)
    } catch (error) {
      console.error('Send message error:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Show login prompt for guests
  if (!currentUser && isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="card w-80 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please login to start chatting
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="btn btn-primary w-full"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-50 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg"
          >
            <FiMessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-96 h-[500px] card p-0 flex flex-col overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <FiMessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold">Live Chat</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <FiMinimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isOwn={msg.userId === currentUser?.uid}
                  />
                ))
              )}
              
              {/* Typing Indicator */}
              {Object.keys(typingUsers).filter(uid => uid !== currentUser?.uid).length > 0 && (
                <TypingIndicator />
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 input"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || sending}
                  className="btn btn-primary p-3"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
