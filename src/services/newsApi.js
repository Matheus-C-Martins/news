/**
 * NewsAPI Service with Language Support and Proxy Integration
 * 
 * Environment-aware API calling:
 * - LOCAL DEVELOPMENT: Direct calls to NewsAPI (API key in .env.local)
 * - GITHUB PAGES: Proxied calls through backend (hides API key in production)
 */

import {
  getCurrentLanguage,
  getSelectedSourcesForLanguage,
  LANGUAGES,
  SOURCE_BY_LANGUAGE
} from './languages'

// Environment detection
const isDevelopment = !import.meta.env.PROD
const isProduction = import.meta.env.PROD

// Environment variables (set by .env.local locally or GitHub Actions for production)
const API_KEY = import.meta.env.VUE_APP_NEWS_API_KEY
const PROXY_URL = import.meta.env.VUE_APP_VERCEL_API_URL

// Determine which mode to use
const USE_PROXY = Boolean(PROXY_URL)
const BASE_URL = PROXY_URL || 'https://newsapi.org/v2'

// Debug info
if (isDevelopment) {
  console.log('=== NewsAPI Service Configuration ===')
  console.log('Environment: DEVELOPMENT')
  console.log('Using direct API calls:', !USE_PROXY)
  if (!API_KEY) {
    console.warn(
      '⚠️  VUE_APP_NEWS_API_KEY is not set!\n' +
      'For local development, copy .env.local.example to .env.local\n' +
      'and add your NewsAPI key from https://newsapi.org'
    )
  } else {
    console.log('✓ API Key loaded from .env.local')
  }
}

if (isProduction) {
  console.log('=== NewsAPI Service Configuration ===')
  console.log('Environment: PRODUCTION (GitHub Pages)')
  if (USE_PROXY) {
    console.log('✓ Using proxy at:', PROXY_URL)
    console.log('✓ API key is protected (hidden from browser)')
  } else {
    console.warn('⚠️  No proxy configured! API key is exposed in production.')
    console.warn('For security, configure VUE_APP_VERCEL_API_URL in GitHub Secrets')
  }
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
 * When using proxy: No API key (backend handles it)
 * When direct: Include API key for NewsAPI authentication
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  // Only add API key for direct NewsAPI calls (not proxied)
  if (!USE_PROXY && API_KEY) {
    headers['X-Api-Key'] = API_KEY
  }
  
  return headers
}

/**
 * Build API URL based on environment
 * 
 * LOCAL DEVELOPMENT (direct):
 *   base: https://newsapi.org/v2
 *   url: https://newsapi.org/v2/top-headlines?language=en&...
 * 
 * GITHUB PAGES (proxied):
 *   base: https://your-backend.vercel.app/api
 *   url: https://your-backend.vercel.app/api?endpoint=top-headlines&language=en&...
 */
function buildApiUrl(endpoint, params) {
  if (USE_PROXY) {
    // Proxy mode: pass endpoint as query param
    const proxyParams = new URLSearchParams(params)
    proxyParams.append('endpoint', endpoint)
    return `${BASE_URL}?${proxyParams}`
  } else {
    // Direct mode: endpoint in URL path
    return `${BASE_URL}/${endpoint}?${params}`
  }
}

/**
 * Handle API response errors with detailed messages
 */
function handleResponseError(response, context) {
  let errorMessage = `API Error: ${response.status} ${response.statusText}`
  
  if (response.status === 401) {
    if (USE_PROXY) {
      errorMessage = 'Proxy authentication failed. Check your backend configuration.'
    } else {
      errorMessage = 'Authentication failed: Invalid API key. Check VUE_APP_NEWS_API_KEY in .env.local'
    }
  } else if (response.status === 403) {
    errorMessage = 'Access denied: API key may not have permission for this endpoint.'
  } else if (response.status === 429) {
    errorMessage = 'Rate limit exceeded: Too many requests. Please try again later.'
  } else if (response.status === 500) {
    if (USE_PROXY) {
      errorMessage = 'Proxy server error: Your backend service is temporarily unavailable.'
    } else {
      errorMessage = 'NewsAPI server error: Service temporarily unavailable.'
    }
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
    
    if (isDevelopment) {
      console.debug('[API] Fetching top headlines:', { url: url.split('?')[0], params: Object.fromEntries(params) })
    }
    
    const response = await fetch(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw handleResponseError(response, 'fetchTopHeadlines')
    }
    
    const data = await response.json()
    if (isDevelopment) {
      console.debug(`[API] ✓ Top headlines fetched: ${data.articles?.length || 0} articles`)
    }
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
    
    if (isDevelopment) {
      console.debug('[API] Searching news:', { query, params: Object.fromEntries(params) })
    }
    
    const response = await fetch(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw handleResponseError(response, 'searchNews')
    }
    
    const data = await response.json()
    if (isDevelopment) {
      console.debug(`[API] ✓ Search completed: ${data.articles?.length || 0} articles`)
    }
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
    environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
    usingProxy: USE_PROXY,
    baseUrl: BASE_URL,
    proxyUrl: PROXY_URL || undefined,
    hasApiKey: Boolean(API_KEY),
    apiKeyLength: API_KEY ? API_KEY.length : 0,
    configStatus: {
      development: {
        description: 'Direct API calls with API key',
        requiresProxy: false,
        apiKeyExposed: true,
        status: !USE_PROXY ? '✓ Configured' : '✗ Proxy detected'
      },
      production: {
        description: 'Proxied calls (API key hidden)',
        requiresProxy: true,
        apiKeyExposed: false,
        status: USE_PROXY ? '✓ Configured' : '⚠ Using direct API (not recommended)'
      }
    }
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
  
  if (isProduction && !USE_PROXY) {
    console.warn(
      '\n⚠️  SECURITY WARNING:\n' +
      'Your API key is exposed in production!\n' +
      'Configure VUE_APP_VERCEL_API_URL in GitHub Secrets to use a proxy.\n'
    )
  }
  
  if (isDevelopment && !API_KEY) {
    console.warn(
      '\n⚠️  SETUP REQUIRED:\n' +
      '1. Copy .env.local.example to .env.local\n' +
      '2. Add your NewsAPI key from https://newsapi.org\n' +
      '3. Restart the development server\n'
    )
  }
}
