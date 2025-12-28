/**
 * NewsAPI Service with Language Support
 * Handles all API calls with language and source filtering
 */

import {
  getCurrentLanguage,
  getSelectedSourcesForLanguage,
  LANGUAGES,
  SOURCE_BY_LANGUAGE
} from './languages'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY
const BASE_URL = 'https://newsapi.org/v2'

/**
 * Get headers for API requests
 */
function getHeaders() {
  return {
    'X-Api-Key': API_KEY,
    'Content-Type': 'application/json'
  }
}

/**
 * Fetch top headlines with language support
 * @param {Object} options - Query options
 * @param {string} options.category - News category (optional)
 * @param {string} options.language - Language code (optional, defaults to current)
 * @param {number} options.page - Page number (optional)
 * @param {number} options.pageSize - Results per page (default: 20)
 */
export async function fetchTopHeadlines(options = {}) {
  const language = options.language || getCurrentLanguage()
  const languageConfig = LANGUAGES[language]
  
  if (!languageConfig) {
    throw new Error(`Unsupported language: ${language}`)
  }

  const params = new URLSearchParams()
  params.append('language', languageConfig.apiLanguage)
  params.append('pageSize', options.pageSize || 20)
  
  if (options.page) {
    params.append('page', options.page)
  }

  if (options.category) {
    params.append('category', options.category)
  }

  // Get selected sources for this language
  const selectedSources = getSelectedSourcesForLanguage(language)
  if (selectedSources && selectedSources.length > 0) {
    params.append('sources', selectedSources.join(','))
  }

  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?${params}`,
      { headers: getHeaders() }
    )
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching top headlines:', error)
    throw error
  }
}

/**
 * Fetch news with everything endpoint (more flexible)
 * @param {Object} options - Query options
 * @param {string} options.q - Search query
 * @param {string} options.language - Language code (optional, defaults to current)
 * @param {string} options.sortBy - Sort method ('relevancy', 'popularity', 'publishedAt')
 * @param {number} options.page - Page number (optional)
 * @param {number} options.pageSize - Results per page (default: 20)
 */
export async function searchNews(options = {}) {
  if (!options.q) {
    throw new Error('Search query (q) is required')
  }

  const language = options.language || getCurrentLanguage()
  const languageConfig = LANGUAGES[language]
  
  if (!languageConfig) {
    throw new Error(`Unsupported language: ${language}`)
  }

  const params = new URLSearchParams()
  params.append('q', options.q)
  params.append('language', languageConfig.apiLanguage)
  params.append('sortBy', options.sortBy || 'publishedAt')
  params.append('pageSize', options.pageSize || 20)
  
  if (options.page) {
    params.append('page', options.page)
  }

  // Get selected sources for this language
  const selectedSources = getSelectedSourcesForLanguage(language)
  if (selectedSources && selectedSources.length > 0) {
    params.append('sources', selectedSources.join(','))
  }

  try {
    const response = await fetch(
      `${BASE_URL}/everything?${params}`,
      { headers: getHeaders() }
    )
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error searching news:', error)
    throw error
  }
}

/**
 * Get available sources for the current language
 * @param {string} language - Language code (optional)
 */
export function getAvailableSources(language = null) {
  const lang = language || getCurrentLanguage()
  return SOURCE_BY_LANGUAGE[lang] || SOURCE_BY_LANGUAGE['en']
}

/**
 * Get currently selected sources
 * @param {string} language - Language code (optional)
 */
export function getSelectedSources(language = null) {
  const lang = language || getCurrentLanguage()
  return getSelectedSourcesForLanguage(lang)
}

/**
 * Get current language
 */
export function getCurrentLanguageInfo() {
  const lang = getCurrentLanguage()
  return LANGUAGES[lang]
}
