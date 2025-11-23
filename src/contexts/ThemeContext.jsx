import { createContext, useContext, useState, useEffect } from 'react'

// Import your theme JSON files
import glass from '../styles/themes/glass.json'
import minimal from '../styles/themes/minimal.json'
import modern from '../styles/themes/modern.json'

const themes = { glass, minimal, modern }

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
    
    if (savedTheme) setTheme(savedTheme)
    if (savedDarkMode) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Apply Theme Variables
  useEffect(() => {
    const selectedTheme = themes[theme]
    if (!selectedTheme) return

    const root = document.documentElement

    // apply light variables
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // apply light gradients
    Object.entries(selectedTheme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value)
    })

    // typography
    Object.entries(selectedTheme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value)
    })

    // spacing
    Object.entries(selectedTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // effects
    Object.entries(selectedTheme.effects).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })

    // DARK MODE SUPPORT
    if (darkMode && selectedTheme.darkColors) {
      Object.entries(selectedTheme.darkColors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
      })
    }
  }, [theme, darkMode])

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('mitc-dark-mode', newDarkMode.toString())
    
    if (newDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, darkMode, changeTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
