/**
 * useSettings Composable
 * Provides reactive access to user settings across the entire app
 * Syncs with localStorage and automatically applies changes
 */

import { ref, watch, onMounted } from 'vue'
import { getCurrentLanguage, setLanguage as setAppLanguage, LANGUAGES } from '@/services/languages'

// Reactive settings state (shared across all components)
const isDarkMode = ref(false)
const currentLanguage = ref('en')
const isInitialized = ref(false)

/**
 * Clean up old localStorage keys from previous versions
 */
function cleanupOldKeys() {
  // Remove old dark mode key if it exists
  if (localStorage.getItem('isDarkMode') !== null) {
    const oldValue = localStorage.getItem('isDarkMode') === 'true'
    // Migrate to new key if new key doesn't exist
    if (localStorage.getItem('darkMode') === null) {
      localStorage.setItem('darkMode', String(oldValue))
    }
    localStorage.removeItem('isDarkMode')
  }

  // Remove old language key if it exists
  if (localStorage.getItem('appLanguage') !== null) {
    const oldValue = localStorage.getItem('appLanguage')
    // Migrate to new key if new key doesn't exist
    if (localStorage.getItem('language') === null && LANGUAGES[oldValue]) {
      localStorage.setItem('language', oldValue)
    }
    localStorage.removeItem('appLanguage')
  }
}

/**
 * Initialize settings from localStorage
 */
function initializeSettings() {
  if (isInitialized.value) return

  // Clean up old keys first
  cleanupOldKeys()

  // Load dark mode from localStorage (stored as string 'true' or 'false')
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode !== null) {
    isDarkMode.value = savedMode === 'true'
  } else {
    // Default to system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyDarkMode(isDarkMode.value)

  // Load language from localStorage with English as default
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && LANGUAGES[savedLanguage]) {
    currentLanguage.value = savedLanguage
    setAppLanguage(savedLanguage)
  } else {
    // Default to English
    currentLanguage.value = 'en'
    setAppLanguage('en')
    localStorage.setItem('language', 'en')
  }

  isInitialized.value = true
}

/**
 * Apply dark mode to document
 */
function applyDarkMode(isDark) {
  const html = document.documentElement
  if (isDark) {
    html.classList.add('dark-mode')
  } else {
    html.classList.remove('dark-mode')
  }
  // Store as string for localStorage
  localStorage.setItem('darkMode', String(isDark))
}

/**
 * Toggle dark mode on/off
 */
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  applyDarkMode(isDarkMode.value)
}

/**
 * Change language and save to localStorage
 */
function changeLanguage(lang) {
  // Validate language
  if (!LANGUAGES[lang]) {
    console.warn(`Invalid language: ${lang}. Keeping current language.`)
    return
  }
  
  currentLanguage.value = lang
  setAppLanguage(lang)
  localStorage.setItem('language', lang)
  // Force re-render of views by triggering language change
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }))
}

/**
 * Watch for localStorage changes from other tabs/windows
 */
function watchStorageChanges() {
  window.addEventListener('storage', (event) => {
    if (event.key === 'darkMode') {
      isDarkMode.value = event.newValue === 'true'
      applyDarkMode(isDarkMode.value)
    } else if (event.key === 'language') {
      const newLang = event.newValue || 'en'
      if (LANGUAGES[newLang]) {
        currentLanguage.value = newLang
        setAppLanguage(newLang)
      }
    }
  })
}

/**
 * Composable hook for using settings in components
 */
export function useSettings() {
  // Initialize on first mount
  onMounted(() => {
    if (!isInitialized.value) {
      initializeSettings()
      watchStorageChanges()
    }
  })

  // Watch for changes and sync
  watch(isDarkMode, (newVal) => {
    applyDarkMode(newVal)
  })

  watch(currentLanguage, (newVal) => {
    if (LANGUAGES[newVal]) {
      setAppLanguage(newVal)
      localStorage.setItem('language', newVal)
    }
  })

  return {
    isDarkMode,
    language: currentLanguage,
    currentLanguage,
    toggleDarkMode,
    setLanguage: changeLanguage,
    changeLanguage,
    initializeSettings
  }
}

/**
 * Export reactive refs for use in App.vue provider
 */
export { isDarkMode, currentLanguage }
