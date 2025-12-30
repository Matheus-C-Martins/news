import { describe, it, expect, beforeEach } from 'vitest'
import { useSettings } from '@/composables/useSettings'

describe('useSettings.js', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Dark Mode', () => {
    it('initializes with light mode by default', () => {
      const { isDarkMode } = useSettings()
      expect(isDarkMode.value).toBe(false)
    })

    it('loads saved dark mode preference from localStorage', () => {
      localStorage.setItem('darkMode', 'true')
      const { isDarkMode } = useSettings()
      expect(isDarkMode.value).toBe(true)
    })

    it('toggles dark mode', () => {
      const { isDarkMode, toggleDarkMode } = useSettings()
      
      expect(isDarkMode.value).toBe(false)
      toggleDarkMode()
      expect(isDarkMode.value).toBe(true)
      toggleDarkMode()
      expect(isDarkMode.value).toBe(false)
    })

    it('persists dark mode preference to localStorage', () => {
      const { toggleDarkMode } = useSettings()
      
      toggleDarkMode()
      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true')
    })

    it('applies dark-mode class to document', () => {
      const { toggleDarkMode } = useSettings()
      
      toggleDarkMode()
      expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
      
      toggleDarkMode()
      expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
    })
  })

  describe('Language Settings', () => {
    it('initializes with English by default', () => {
      const { language } = useSettings()
      expect(language.value).toBe('en')
    })

    it('loads saved language preference', () => {
      localStorage.setItem('language', 'pt')
      const { language } = useSettings()
      expect(language.value).toBe('pt')
    })

    it('changes language', () => {
      const { language, setLanguage } = useSettings()
      
      setLanguage('es')
      expect(language.value).toBe('es')
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'es')
    })

    it('validates language code', () => {
      const { setLanguage, language } = useSettings()
      
      setLanguage('invalid')
      expect(language.value).toBe('en') // Falls back to default
    })
  })
})
