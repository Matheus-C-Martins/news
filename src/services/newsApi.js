/**
 * NewsAPI Service - Always Using Proxy
 * 
 * Simplified configuration:
 * - LOCAL DEVELOPMENT: Calls proxy at VUE_APP_VERCEL_API_URL
 * - GITHUB PAGES: Calls proxy at VUE_APP_VERCEL_API_URL
 * 
 * Proxy URL is set in:
 * - .env.local (locally)
 * - GitHub Secrets VUE_APP_VERCEL_API_URL (production)
 */

import {
  getCurrentLanguage,
  getSelectedSourcesForLanguage,
  LANGUAGES,
  SOURCE_BY_LANGUAGE
} from './languages'

// Get proxy URL from environment
const PROXY_URL = import.meta.env.VUE_APP_VERCEL_API_URL || '/api'
const BASE_URL = PROXY_URL

// Always use proxy
const USE_PROXY = true

// Debug info
console.log('=== NewsAPI Service Configuration ===')
console.log('Mode: ALWAYS USE PROXY')
console.log('Proxy URL:', PROXY_URL)
console.log('API Key: Handled by backend proxy')

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
  if (!/^[a-zA-Z0-9\s\-.,&()']+([\s][a-zA-Z0-9\-.,&()'"]+)*$/.test(sanitized)) {
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
 * No API key headers needed - proxy backend handles it
 */
function getHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}

/**
 * Build API URL for proxy
 * 
 * Format: https://proxy.vercel.app/api?endpoint=top-headlines&language=en&...
 */
function buildApiUrl(endpoint, params) {
  const proxyParams = new URLSearchParams(params)
  proxyParams.append('endpoint', endpoint)
  return `${BASE_URL}?${proxyParams}`
}

/**
 * Handle API response errors with detailed messages
 */
function handleResponseError(response, context) {
  let errorMessage = `API Error: ${response.status} ${response.statusText}`
  
  if (response.status === 401) {
    errorMessage = 'Proxy authentication failed. Check backend configuration.'
  } else if (response.status === 403) {
    errorMessage = 'Access denied: Backend may not have API key configured.'
  } else if (response.status === 429) {
    errorMessage = 'Rate limit exceeded: Too many requests. Please try again later.'
  } else if (response.status === 500) {
    errorMessage = 'Proxy server error: Backend service temporarily unavailable.'
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
    
    console.debug('[API] Fetching top headlines:', { url: url.split('?')[0], params: Object.fromEntries(params) })
    
    const response = await fetch(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw handleResponseError(response, 'fetchTopHeadlines')
    }
    
    const data = await response.json()
    console.debug(`[API] ✓ Top headlines fetched: ${data.articles?.length || 0} articles`)
    return data
  } catch (error) {
    console.error('[API] Error fetching top headlines:', error.message)
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
    
    console.debug('[API] Searching news:', { query, params: Object.fromEntries(params) })
    
    const response = await fetch(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw handleResponseError(response, 'searchNews')
    }
    
    const data = await response.json()
    console.debug(`[API] ✓ Search completed: ${data.articles?.length || 0} articles`)
    return data
  } catch (error) {
    console.error('[API] Error searching news:', error.message)
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
 * Get current language info
 */
export function getCurrentLanguageInfo() {
  const lang = getCurrentLanguage()
  return LANGUAGES[lang]
}

/**
 * Get API configuration status
 * Useful for debugging environment setup
 */
export function getApiConfig() {
  return {
    mode: 'PROXY_ONLY',
    proxyUrl: PROXY_URL,
    usingProxy: true,
    message: 'Always using proxy - no direct API calls',
    environment: import.meta.env.DEV ? 'DEVELOPMENT' : 'PRODUCTION'
  }
}

/**
 * Initialize and log configuration on app startup
 */
export function initializeApiService() {
  console.log('\n╔════════════════════════════════════════╗')
  console.log('║   NewsAPI Service Initialization      ║')
  console.log('╚════════════════════════════════════════╝\n')
  
  const config = getApiConfig()
  console.table(config)
  
  if (!PROXY_URL || PROXY_URL === '/api') {
    console.warn(
      '\n⚠️  PROXY CONFIGURATION:\n' +
      'Make sure your proxy is running or deployed.\n' +
      'VUE_APP_VERCEL_API_URL should point to your proxy server.\n'
    )
  }
}
