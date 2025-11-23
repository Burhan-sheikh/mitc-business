import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => useContext(ThemeContext)

const THEME_STORAGE_KEY = 'mitc-theme'

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('modern')
  const [darkMode, setDarkMode] = useState(false)

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const savedDarkMode = localStorage.getItem('mitc-dark-mode') === 'true'
    
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    if (savedDarkMode) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Update theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('mitc-dark-mode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const value = {
    theme,
    darkMode,
    changeTheme,
    toggleDarkMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
