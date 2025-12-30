import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchTopHeadlines, searchNews } from '@/services/newsApi.js'

describe('newsApi.js', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn()
  })

  describe('fetchTopHeadlines', () => {
    it('fetches top headlines successfully', async () => {
      const mockResponse = {
        status: 'ok',
        totalResults: 10,
        articles: [
          { title: 'Article 1' },
          { title: 'Article 2' },
        ],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await fetchTopHeadlines({ page: 1, pageSize: 20 })

      expect(result.articles).toHaveLength(2)
      expect(result.totalResults).toBe(10)
      expect(result.status).toBe('ok')
    })

    it('handles API errors gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid API key' }),
      })

      await expect(fetchTopHeadlines({ page: 1 })).rejects.toThrow()
    })

    it('validates page number', async () => {
      await expect(fetchTopHeadlines({ page: 0 })).rejects.toThrow()
      await expect(fetchTopHeadlines({ page: -1 })).rejects.toThrow()
      await expect(fetchTopHeadlines({ page: 101 })).rejects.toThrow()
    })

    it('accepts valid categories', async () => {
      const mockResponse = {
        status: 'ok',
        articles: [],
      }

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const validCategories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']

      for (const category of validCategories) {
        await fetchTopHeadlines({ category, page: 1 })
        expect(global.fetch).toHaveBeenCalled()
      }
    })

    it('rejects invalid categories', async () => {
      await expect(fetchTopHeadlines({ category: 'invalid', page: 1 })).rejects.toThrow()
    })
  })

  describe('searchNews', () => {
    it('searches news successfully', async () => {
      const mockResponse = {
        status: 'ok',
        totalResults: 100,
        articles: [{ title: 'Search Result' }],
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await searchNews({ q: 'technology', page: 1 })

      expect(result.articles).toHaveLength(1)
      expect(result.totalResults).toBe(100)
    })

    it('requires search query', async () => {
      await expect(searchNews({ q: '', page: 1 })).rejects.toThrow()
      await expect(searchNews({ page: 1 })).rejects.toThrow()
    })

    it('validates search query length', async () => {
      const longQuery = 'a'.repeat(501)
      await expect(searchNews({ q: longQuery, page: 1 })).rejects.toThrow()
    })

    it('accepts valid sort options', async () => {
      const mockResponse = { status: 'ok', articles: [] }
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const validSortBy = ['relevancy', 'popularity', 'publishedAt']

      for (const sortBy of validSortBy) {
        await searchNews({ q: 'test', sortBy, page: 1 })
        expect(global.fetch).toHaveBeenCalled()
      }
    })
  })
})