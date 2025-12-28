/**
 * News Service - Handles all API calls to NewsAPI
 * 
 * Get your free API key at: https://newsapi.org/
 * Free tier: 100 requests per day
 */

// ⚠️ API Key is loaded from environment variables for security
// Create a .env.local file with: VUE_APP_NEWS_API_KEY=your_key_here
const API_KEY = process.env.VUE_APP_NEWS_API_KEY
const BASE_URL = 'https://newsapi.org/v2'

/**
 * Fetch news articles by category
 * @param {string} category - Category slug (business, sports, technology, entertainment, health, science, general)
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} - Articles data or error
 */
export async function fetchNewsByCategory(category = 'general', page = 1) {
  // Validate API key
  if (!API_KEY) {
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: 'API key not configured. Please set VUE_APP_NEWS_API_KEY in your .env.local file'
    }
  }

  try {
    const endpoint = `${BASE_URL}/top-headlines?category=${category}&country=us&page=${page}&apiKey=${API_KEY}`
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
 * @returns {Promise<Object>} - Search results
 */
export async function searchNews(query, sortBy = 'relevancy', page = 1) {
  if (!API_KEY) {
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: 'API key not configured. Please set VUE_APP_NEWS_API_KEY in your .env.local file'
    }
  }

  try {
    if (!query.trim()) {
      return { articles: [], totalResults: 0, status: 'ok' }
    }
    
    const endpoint = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&page=${page}&apiKey=${API_KEY}`
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
 * @param {string} country - Country code (us, gb, fr, de, etc.)
 * @param {number} page - Page number
 * @returns {Promise<Object>} - Headlines
 */
export async function fetchTopHeadlines(country = 'us', page = 1) {
  if (!API_KEY) {
    return {
      articles: [],
      totalResults: 0,
      status: 'error',
      message: 'API key not configured. Please set VUE_APP_NEWS_API_KEY in your .env.local file'
    }
  }

  try {
    const endpoint = `${BASE_URL}/top-headlines?country=${country}&page=${page}&apiKey=${API_KEY}`
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
  CATEGORY_MAP
}