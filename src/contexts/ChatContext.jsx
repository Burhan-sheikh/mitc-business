import { createContext, useContext, useState, useEffect } from 'react'
import { ref, onValue, push, update, serverTimestamp } from 'firebase/database'
import { rtdb } from '../config/firebase'
import { useAuth } from './AuthContext'

const ChatContext = createContext({})

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const { currentUser, userData } = useAuth()
  const [activeChats, setActiveChats] = useState({})
  const [unreadCounts, setUnreadCounts] = useState({})

  // Send message
  const sendMessage = async (productId, message) => {
    if (!currentUser || !message.trim()) return

    try {
      const chatRef = ref(rtdb, `chats/${productId}`)
      await push(chatRef, {
        userId: currentUser.uid,
        userName: userData?.displayName || 'Anonymous',
        message: message.trim(),
        timestamp: Date.now(),
        read: false,
      })
    } catch (error) {
      console.error('Send message error:', error)
      throw error
    }
  }

  // Mark messages as read
  const markAsRead = async (productId, messageId) => {
    try {
      const messageRef = ref(rtdb, `chats/${productId}/${messageId}`)
      await update(messageRef, { read: true })
    } catch (error) {
      console.error('Mark as read error:', error)
    }
  }

  // Update typing indicator
  const updateTypingStatus = async (productId, isTyping) => {
    if (!currentUser) return

    try {
      const typingRef = ref(rtdb, `typing/${productId}/${currentUser.uid}`)
      if (isTyping) {
        await update(typingRef, { timestamp: Date.now() })
      } else {
        await update(typingRef, null)
      }
    } catch (error) {
      console.error('Typing status error:', error)
    }
  }

  // Subscribe to product chat
  const subscribeToChat = (productId, callback) => {
    const chatRef = ref(rtdb, `chats/${productId}`)
    return onValue(chatRef, (snapshot) => {
      const messages = []
      snapshot.forEach((child) => {
        messages.push({
          id: child.key,
          ...child.val(),
        })
      })
      callback(messages)
    })
  }

  // Subscribe to typing indicators
  const subscribeToTyping = (productId, callback) => {
    const typingRef = ref(rtdb, `typing/${productId}`)
    return onValue(typingRef, (snapshot) => {
      const typing = {}
      snapshot.forEach((child) => {
        const timestamp = child.val().timestamp
        // Only consider typing if timestamp is within last 3 seconds
        if (Date.now() - timestamp < 3000) {
          typing[child.key] = true
        }
      })
      callback(typing)
    })
  }

  const value = {
    activeChats,
    unreadCounts,
    sendMessage,
    markAsRead,
    updateTypingStatus,
    subscribeToChat,
    subscribeToTyping,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
