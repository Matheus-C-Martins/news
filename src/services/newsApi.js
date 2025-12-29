/**
 * NewsAPI Service with Language Support
 * Handles all API calls with language and source filtering
 * Supports both direct API calls and Vercel proxy
 */

import {
  getCurrentLanguage,
  getSelectedSourcesForLanguage,
  LANGUAGES,
  SOURCE_BY_LANGUAGE
} from './languages'

// Use VUE_APP_ prefix for Vue CLI environment variables
const API_KEY = import.meta.env.VUE_APP_NEWS_API_KEY
// Use custom API base URL if provided (e.g., Vercel proxy), otherwise use NewsAPI directly
const BASE_URL = import.meta.env.VUE_APP_VERCEL_API_URL || 'https://newsapi.org/v2'
const USE_PROXY = Boolean(import.meta.env.VUE_APP_VERCEL_API_URL)

// Debug log for environment variables (only show if API_KEY is missing)
if (!API_KEY && !USE_PROXY) {
  console.warn(
    'Warning: VUE_APP_NEWS_API_KEY environment variable is not set. ' +
    'API requests will fail. Please set the environment variable in your .env.local file.'
  )
}

if (USE_PROXY) {
  console.log('Using API proxy at:', BASE_URL)
}

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
  if (!/^[a-zA-Z0-9\s\-.,&()']+([\s][a-zA-Z0-9\-.,&()"']+)*$/.test(sanitized)) {
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
 * Only include API key when calling NewsAPI directly (not through proxy)
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  // Only add API key for direct NewsAPI calls (not for proxy)
  if (!USE_PROXY && API_KEY) {
    headers['X-Api-Key'] = API_KEY
  }
  
  return headers
}

/**
 * Build API URL based on proxy or direct mode
 * @param {string} endpoint - API endpoint (e.g., 'top-headlines', 'everything')
 * @param {URLSearchParams} params - Query parameters
 */
function buildApiUrl(endpoint, params) {
  if (USE_PROXY) {
    // When using proxy, proxy handles the endpoint routing
    return `${BASE_URL}?${params}`
  } else {
    // Direct NewsAPI call
    return `${BASE_URL}/${endpoint}?${params}`
  }
}

/**
 * Handle API response errors
 * @param {Response} response - Fetch response object
 * @param {string} context - Context for error message
 */
function handleResponseError(response, context) {
  let errorMessage = `API Error: ${response.status} ${response.statusText}`
  
  if (response.status === 401) {
    errorMessage = 'Authentication failed: Invalid API key. Check your VUE_APP_NEWS_API_KEY environment variable.'
  } else if (response.status === 403) {
    errorMessage = 'Access denied: Your API key may not have permission for this endpoint.'
  } else if (response.status === 429) {
    errorMessage = 'Rate limit exceeded: Too many requests. Please try again later.'
  } else if (response.status === 500) {
    errorMessage = 'Server error: The API service is temporarily unavailable.'
  }
  
  console.error(`[${context}] ${errorMessage}`)
  return new Error(errorMessage)
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
    const url = buildApiUrl('top-headlines', params)
    const headers = getHeaders()
    
    console.debug('Fetching top headlines:', { url, headers: Object.keys(headers) })
    
    const response = await fetch(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw handleResponseError(response, 'fetchTopHeadlines')
    }
    
    const data = await response.json()
    console.debug('Top headlines fetched successfully:', data.articles?.length || 0, 'articles')
    return data
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
    const url = buildApiUrl('everything', params)
    const headers = getHeaders()
    
    console.debug('Searching news:', { query, url, headers: Object.keys(headers) })
    
    const response = await fetch(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw handleResponseError(response, 'searchNews')
    }
    
    const data = await response.json()
    console.debug('Search completed successfully:', data.articles?.length || 0, 'articles')
    return data
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

/**
 * Check if using proxy mode
 */
export function isUsingProxy() {
  return USE_PROXY
}

/**
 * Get API configuration status
 * Useful for debugging
 */
export function getApiConfig() {
  return {
    usingProxy: USE_PROXY,
    baseUrl: BASE_URL,
    hasApiKey: Boolean(API_KEY),
    apiKeyLength: API_KEY ? API_KEY.length : 0
  }
}
