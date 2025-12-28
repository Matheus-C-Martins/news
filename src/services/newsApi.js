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
 * Validate and sanitize search query
 * @param {string} query - Search query to validate
 * @returns {string} Sanitized query
 */
function validateAndSanitizeQuery(query) {
  if (typeof query !== 'string') {
    throw new Error('Search query must be a string')
  }

  const sanitized = query.trim()
  
  if (sanitized.length === 0) {
    throw new Error('Search query cannot be empty')
  }

  if (sanitized.length > 500) {
    throw new Error('Search query cannot exceed 500 characters')
  }

  // Allow alphanumeric, spaces, and common punctuation
  if (!/^[a-zA-Z0-9\s\-\.\,\&\(\)\']+(\s[a-zA-Z0-9\-\.\,\&\(\)\']+)*$/.test(sanitized)) {
    throw new Error('Search contains invalid characters')
  }

  return sanitized
}

/**
 * Validate page number
 * @param {number} page - Page number to validate
 * @returns {number} Validated page number
 */
function validatePageNumber(page) {
  if (page === undefined || page === null) return undefined
  
  const pageNum = parseInt(page, 10)
  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('Page number must be a positive integer')
  }
  if (pageNum > 100) {
    throw new Error('Page number cannot exceed 100')
  }
  
  return pageNum
}

/**
 * Validate category
 * @param {string} category - Category to validate
 * @returns {string} Validated category
 */
function validateCategory(category) {
  if (!category) return undefined
  
  const validCategories = [
    'business', 'entertainment', 'general', 'health', 'science',
    'sports', 'technology', 'all'
  ]
  
  if (!validCategories.includes(category.toLowerCase())) {
    throw new Error(`Invalid category: ${category}`)
  }
  
  return category.toLowerCase()
}

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

  // Validate inputs
  const category = options.category ? validateCategory(options.category) : undefined
  const page = validatePageNumber(options.page)
  const pageSize = Math.min(Math.max(parseInt(options.pageSize, 10) || 20, 1), 100)

  const params = new URLSearchParams()
  params.append('language', languageConfig.apiLanguage)
  params.append('pageSize', pageSize)
  
  if (page) {
    params.append('page', page)
  }

  if (category && category !== 'all') {
    params.append('category', category)
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

  // Validate and sanitize search query
  const query = validateAndSanitizeQuery(options.q)

  const language = options.language || getCurrentLanguage()
  const languageConfig = LANGUAGES[language]
  
  if (!languageConfig) {
    throw new Error(`Unsupported language: ${language}`)
  }

  // Validate sort method
  const validSortMethods = ['relevancy', 'popularity', 'publishedAt']
  const sortBy = validSortMethods.includes(options.sortBy) ? options.sortBy : 'publishedAt'
  
  // Validate page and pageSize
  const page = validatePageNumber(options.page)
  const pageSize = Math.min(Math.max(parseInt(options.pageSize, 10) || 20, 1), 100)

  const params = new URLSearchParams()
  params.append('q', query)
  params.append('language', languageConfig.apiLanguage)
  params.append('sortBy', sortBy)
  params.append('pageSize', pageSize)
  
  if (page) {
    params.append('page', page)
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