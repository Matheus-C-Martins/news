/**
 * useSettings Composable
 * Provides reactive access to user settings across the entire app
 * Syncs with localStorage and automatically applies changes
 */

import { ref, watch, onMounted } from 'vue'
import { getCurrentLanguage, setLanguage } from '@/services/languages'

// Reactive settings state
const isDarkMode = ref(false)
const currentLanguage = ref('en')
const isInitialized = ref(false)

/**
 * Initialize settings from localStorage
 */
function initializeSettings() {
  if (isInitialized.value) return

  // Load dark mode
  const savedMode = localStorage.getItem('darkMode')
  if (savedMode !== null) {
    isDarkMode.value = savedMode === 'true'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyDarkMode(isDarkMode.value)

  // Load language
  currentLanguage.value = getCurrentLanguage()

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
  localStorage.setItem('darkMode', isDark)
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
  currentLanguage.value = lang
  setLanguage(lang)
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
    } else if (event.key === 'appLanguage') {
      currentLanguage.value = event.newValue || 'en'
    }
  })
}

/**
 * Composable hook for using settings in components
 */
export function useSettings() {
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
    setLanguage(newVal)
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
