/**
 * News Service - Handles all API calls to NewsAPI via Vercel proxy
 * 
 * The Vercel serverless function acts as a proxy to avoid CORS issues
 * with NewsAPI's Developer plan.
 * 
 * Get your free API key at: https://newsapi.org/
 * Free tier: 100 requests per day
 */

import { getCurrentLanguage, LANGUAGES } from './languages'

// ⚠️ Vercel API URL is loaded from environment variables
// In production (GitHub Pages), this should be your Vercel deployment URL
// In development, you can use localhost or your Vercel URL
const VERCEL_API_URL = process.env.VUE_APP_VERCEL_API_URL || 'https://news-mu-lemon.vercel.app/api/news'

/**
 * Get the country code for the current language
 * @param {string} languageCode - Language code (en, pt, es, fr, de, it)
 * @returns {string} - Country code for the language
 */
function getCountryForLanguage(languageCode) {
  const lang = LANGUAGES[languageCode]
  if (lang && lang.defaultCountry) {
    return lang.defaultCountry
  }
  return 'us' // Fallback to US English
}

/**
 * Fetch news articles by category
 * @param {string} category - Category slug (business, sports, technology, entertainment, health, science, general)
 * @param {number} page - Page number for pagination
 * @param {string} language - Optional language code. If not provided, uses current language from settings
 * @returns {Promise<Object>} - Articles data or error
 */
export async function fetchNewsByCategory(category = 'general', page = 1, language = null) {
  // Validate Vercel API URL
  if (!VERCEL_API_URL) {
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: 'Vercel API URL not configured. Please set VUE_APP_VERCEL_API_URL in your .env.local file'
    }
  }

  try {
    // Use provided language or get current language from settings
    const lang = language || getCurrentLanguage()
    
    const endpoint = `${VERCEL_API_URL}?category=${category}&page=${page}&language=${lang}`
    const response = await fetch(endpoint)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error)
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: error.message
    }
  }
}

/**
 * Search news articles by keyword
 * @param {string} query - Search query
 * @param {string} sortBy - Sort by 'relevancy', 'popularity', 'publishedAt'
 * @param {number} page - Page number for pagination
 * @param {string} language - Optional language code. If not provided, uses current language from settings
 * @returns {Promise<Object>} - Search results
 */
export async function searchNews(query, sortBy = 'relevancy', page = 1, language = null) {
  if (!VERCEL_API_URL) {
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: 'Vercel API URL not configured. Please set VUE_APP_VERCEL_API_URL in your .env.local file'
    }
  }

  try {
    if (!query.trim()) {
      return { articles: [], totalResults: 0, status: 'ok' }
    }
    
    // Use provided language or get current language from settings
    const lang = language || getCurrentLanguage()
    
    const endpoint = `${VERCEL_API_URL}?q=${encodeURIComponent(query)}&sortBy=${sortBy}&page=${page}&language=${lang}`
    const response = await fetch(endpoint)
    
    if (!response.ok) {
      throw new Error(`Search API Error: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error searching news:', error)
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: error.message
    }
  }
}

/**
 * Get top headlines for a specific country
 * @param {string} country - Country code (us, gb, fr, de, etc.). If not provided, uses country for current language
 * @param {number} page - Page number
 * @param {string} language - Optional language code. If not provided, uses current language from settings
 * @returns {Promise<Object>} - Headlines
 */
export async function fetchTopHeadlines(country = null, page = 1, language = null) {
  if (!VERCEL_API_URL) {
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: 'Vercel API URL not configured. Please set VUE_APP_VERCEL_API_URL in your .env.local file'
    }
  }

  try {
    // Use provided language or get current language from settings
    const lang = language || getCurrentLanguage()
    
    const endpoint = `${VERCEL_API_URL}?language=${lang}&page=${page}`
    const response = await fetch(endpoint)
    
    if (!response.ok) {
      throw new Error(`Headlines API Error: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching top headlines:', error)
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: error.message
    }
  }
}

/**
 * Category mapping to NewsAPI categories
 */
export const CATEGORY_MAP = {
  'all': { api: 'general', label: 'All News' },
  'shows': { api: 'entertainment', label: 'Entertainment' },
  'sports': { api: 'sports', label: 'Sports' },
  'technology': { api: 'technology', label: 'Technology' },
  'weather': { api: 'science', label: 'Science & Weather' },
  'business': { api: 'business', label: 'Business' },
  'health': { api: 'health', label: 'Health' },
  'finance': { api: 'business', label: 'Finance' }
}

export default {
  fetchNewsByCategory,
  searchNews,
  fetchTopHeadlines,
  CATEGORY_MAP,
  getCountryForLanguage
}