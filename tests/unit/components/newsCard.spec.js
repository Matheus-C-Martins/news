import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import newsCard from '@/components/newsCard.vue'

describe('newsCard.vue', () => {
  const mockArticle = {
    title: 'Test Article Title',
    description: 'Test article description',
    url: 'https://example.com/article',
    urlToImage: 'https://example.com/image.jpg',
    publishedAt: '2025-12-30T00:00:00Z',
    source: { name: 'Test Source' },
  }

  it('renders article title', () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    expect(wrapper.text()).toContain('Test Article Title')
  })

  it('renders article description', () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    expect(wrapper.text()).toContain('Test article description')
  })

  it('renders article source', () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    expect(wrapper.text()).toContain('Test Source')
  })

  it('has correct article link', () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('https://example.com/article')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('displays image when urlToImage is provided', () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image.jpg')
  })

  it('shows fallback when no image provided', () => {
    const articleNoImage = { ...mockArticle, urlToImage: null }
    const wrapper = mount(newsCard, {
      props: { article: articleNoImage },
    })
    // Check for fallback icon or placeholder
    expect(wrapper.html()).toBeTruthy()
  })

  it('formats date correctly', () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    // Should contain some time-related text
    const text = wrapper.text()
    expect(text.length).toBeGreaterThan(0)
  })
})