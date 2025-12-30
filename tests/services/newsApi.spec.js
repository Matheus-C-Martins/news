import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTopHeadlines, searchNews } from '@/services/newsApi'

describe('newsApi.js', () => {
  beforeEach(() => {
    // Reset environment variables
    vi.stubEnv('VITE_NEWS_API_KEY', 'test-api-key-123')
    vi.stubEnv('VITE_VERCEL_API_URL', '')
  })

  describe('fetchTopHeadlines', () => {
    it('fetches top headlines successfully', async () => {
      const mockResponse = {
        status: 'ok',
        totalResults: 10,
        articles: [
          {
            title: 'Test Article',
            description: 'Test Description',
            url: 'https://example.com'
          }
        ]
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchTopHeadlines({ page: 1, pageSize: 20 })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(result.status).toBe('ok')
      expect(result.articles).toHaveLength(1)
      expect(result.totalResults).toBe(10)
    })

    it('includes API key in request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', articles: [] })
      })

      await fetchTopHeadlines({ page: 1 })

      const callUrl = fetch.mock.calls[0][0]
      expect(callUrl).toContain('apiKey=test-api-key-123')
    })

    it('handles API errors gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({
          status: 'error',
          code: 'apiKeyInvalid',
          message: 'Invalid API key'
        })
      })

      await expect(fetchTopHeadlines({ page: 1 }))
        .rejects.toThrow('Invalid API key')
    })

    it('validates page number', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', articles: [] })
      })

      // Should clamp to valid range (1-100)
      await fetchTopHeadlines({ page: 0 })
      expect(fetch.mock.calls[0][0]).toContain('page=1')

      await fetchTopHeadlines({ page: 101 })
      expect(fetch.mock.calls[1][0]).toContain('page=100')
    })

    it('validates pageSize', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', articles: [] })
      })

      await fetchTopHeadlines({ page: 1, pageSize: 150 })
      expect(fetch.mock.calls[0][0]).toContain('pageSize=100')
    })

    it('supports category filter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', articles: [] })
      })

      await fetchTopHeadlines({ category: 'technology', page: 1 })

      const callUrl = fetch.mock.calls[0][0]
      expect(callUrl).toContain('category=technology')
    })

    it('supports language filter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', articles: [] })
      })

      await fetchTopHeadlines({ language: 'pt', page: 1 })

      const callUrl = fetch.mock.calls[0][0]
      expect(callUrl).toContain('language=pt')
    })
  })

  describe('searchNews', () => {
    it('searches news with query', async () => {
      const mockResponse = {
        status: 'ok',
        totalResults: 5,
        articles: [
          {
            title: 'AI Article',
            description: 'About AI'
          }
        ]
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await searchNews({ q: 'AI', page: 1 })

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(result.articles).toHaveLength(1)
      const callUrl = fetch.mock.calls[0][0]
      expect(callUrl).toContain('q=AI')
    })

    it('validates search query length', async () => {
      const longQuery = 'a'.repeat(501)

      await expect(searchNews({ q: longQuery, page: 1 }))
        .rejects.toThrow('Search query is too long')
    })

    it('sanitizes search query', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', articles: [] })
      })

      await searchNews({ q: 'test <script>alert(1)</script>', page: 1 })

      const callUrl = fetch.mock.calls[0][0]
      expect(callUrl).not.toContain('<script>')
    })

    it('supports sortBy parameter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', articles: [] })
      })

      await searchNews({ q: 'tech', sortBy: 'popularity', page: 1 })

      const callUrl = fetch.mock.calls[0][0]
      expect(callUrl).toContain('sortBy=popularity')
    })

    it('handles network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(searchNews({ q: 'test', page: 1 }))
        .rejects.toThrow('Network error')
    })
  })

  describe('API key validation', () => {
    it('throws error when API key is missing', async () => {
      vi.stubEnv('VITE_NEWS_API_KEY', '')

      await expect(fetchTopHeadlines({ page: 1 }))
        .rejects.toThrow('API key not configured')
    })
  })
})
