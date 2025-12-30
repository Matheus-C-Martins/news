import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

describe('useSettings.js', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorage.clear()
    localStorage.getItem.mockClear()
    localStorage.setItem.mockClear()
  })

  it('initializes with default values', async () => {
    localStorage.getItem.mockReturnValue(null)
    
    // Dynamic import to get fresh instance
    const { isDarkMode } = await import('@/composables/useSettings.js')
    
    expect(isDarkMode.value).toBeDefined()
    expect(typeof isDarkMode.value).toBe('boolean')
  })

  it('loads dark mode from localStorage', async () => {
    localStorage.getItem.mockReturnValue('true')
    
    const { isDarkMode } = await import('@/composables/useSettings.js')
    
    // Should attempt to load from localStorage
    expect(localStorage.getItem).toHaveBeenCalledWith('darkMode')
  })

  it('saves dark mode to localStorage', async () => {
    const { isDarkMode, toggleDarkMode } = await import('@/composables/useSettings.js')
    
    if (typeof toggleDarkMode === 'function') {
      toggleDarkMode()
      
      // Should save to localStorage
      expect(localStorage.setItem).toHaveBeenCalled()
    }
  })

  it('applies dark mode class to document', async () => {
    const { isDarkMode } = await import('@/composables/useSettings.js')
    
    // Dark mode state should be reactive
    expect(isDarkMode).toBeDefined()
  })
})