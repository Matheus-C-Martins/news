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
 * 
 * Improvements:
 * - Response caching to reduce API calls
 * - Retry logic for failed requests
 * - Better error handling
 */

import {
  getCurrentLanguage,
  getSelectedSourcesForLanguage,
  LANGUAGES,
  SOURCE_BY_LANGUAGE
} from './languages'

// Get proxy URL from environment (Vue CLI uses VUE_APP_ prefix)
const PROXY_URL = process.env.VUE_APP_VERCEL_API_URL || '/api'
const BASE_URL = PROXY_URL

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map()

// Debug info
console.log('=== NewsAPI Service Configuration ===')
console.log('Mode: ALWAYS USE PROXY')
console.log('Proxy URL:', PROXY_URL)
console.log('API Key: Handled by backend proxy')
console.log('Cache Duration:', CACHE_DURATION / 1000, 'seconds')

/**
 * Get cached data if available and not expired
 * @param {string} key - Cache key
 * @returns {Object|null} Cached data or null
 */
function getCachedData(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.debug(`[CACHE] ✓ Hit for key: ${key}`)
    return cached.data
  }
  if (cached) {
    console.debug(`[CACHE] ✗ Expired for key: ${key}`)
    cache.delete(key)
  }
  return null
}

/**
 * Set cached data
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 */
function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
  console.debug(`[CACHE] ✓ Stored key: ${key}`)
}

/**
 * Clear all cached data
 */
export function clearCache() {
  const size = cache.size
  cache.clear()
  console.log(`[CACHE] Cleared ${size} entries`)
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  let validEntries = 0
  let expiredEntries = 0
  const now = Date.now()
  
  cache.forEach((value) => {
    if (now - value.timestamp < CACHE_DURATION) {
      validEntries++
    } else {
      expiredEntries++
    }
  })
  
  return {
    total: cache.size,
    valid: validEntries,
    expired: expiredEntries,
    cacheDuration: CACHE_DURATION / 1000
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

  // Relaxed regex to allow more characters including quotes and common punctuation
  if (!/^[a-zA-Z0-9\s\-.,&()'"/+:;?!]+$/.test(sanitized)) {
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
 * Fetch with retry logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retries (default: 3)
 * @returns {Promise<Response>} Response
 */
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      
      // If successful, return immediately
      if (response.ok) {
        return response
      }
      
      // If rate limited and we have retries left, wait and try again
      if (response.status === 429 && i < retries - 1) {
        const waitTime = 1000 * (i + 1) // Exponential backoff: 1s, 2s, 3s
        console.warn(`[RETRY] Rate limited. Waiting ${waitTime}ms before retry ${i + 1}/${retries - 1}`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }
      
      // For other errors, throw immediately
      throw handleResponseError(response, 'fetchWithRetry')
    } catch (error) {
      // If it's the last retry, throw the error
      if (i === retries - 1) {
        throw error
      }
      
      // If it's a network error, wait and retry
      if (error.message.includes('fetch') || error.message.includes('network')) {
        const waitTime = 1000 * (i + 1)
        console.warn(`[RETRY] Network error. Waiting ${waitTime}ms before retry ${i + 1}/${retries - 1}`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      } else {
        // For other errors, throw immediately
        throw error
      }
    }
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

  // Generate cache key
  const cacheKey = `top-headlines:${params.toString()}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const url = buildApiUrl('top-headlines', params)
    const headers = getHeaders()
    
    console.debug('[API] Fetching top headlines:', { url: url.split('?')[0], params: Object.fromEntries(params) })
    
    const response = await fetchWithRetry(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    const data = await response.json()
    console.debug(`[API] ✓ Top headlines fetched: ${data.articles?.length || 0} articles`)
    
    // Cache the result
    setCachedData(cacheKey, data)
    
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

  // Generate cache key
  const cacheKey = `search:${params.toString()}`
  
  // Check cache first
  const cachedData = getCachedData(cacheKey)
  if (cachedData) {
    return cachedData
  }

  try {
    const url = buildApiUrl('everything', params)
    const headers = getHeaders()
    
    console.debug('[API] Searching news:', { query, params: Object.fromEntries(params) })
    
    const response = await fetchWithRetry(url, { 
      headers,
      mode: 'cors',
      credentials: 'omit'
    })
    
    const data = await response.json()
    console.debug(`[API] ✓ Search completed: ${data.articles?.length || 0} articles`)
    
    // Cache the result
    setCachedData(cacheKey, data)
    
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
    environment: process.env.NODE_ENV,
    cacheEnabled: true,
    cacheDuration: CACHE_DURATION / 1000
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
  
  // Clean up expired cache entries on startup
  const stats = getCacheStats()
  if (stats.expired > 0) {
    console.log(`[CACHE] Cleaning up ${stats.expired} expired entries...`)
    cache.forEach((value, key) => {
      if (Date.now() - value.timestamp >= CACHE_DURATION) {
        cache.delete(key)
      }
    })
  }
}
