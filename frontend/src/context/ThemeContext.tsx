import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or default to dark mode
    const stored = localStorage.getItem('theme-mode')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    // Apply theme to HTML element
    const htmlElement = document.documentElement
    if (isDarkMode) {
      htmlElement.classList.add('dark')
      localStorage.setItem('theme-mode', 'dark')
    } else {
      htmlElement.classList.remove('dark')
      localStorage.setItem('theme-mode', 'light')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
