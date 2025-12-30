import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import newsCard from '@/components/newsCard.vue'

describe('newsCard.vue', () => {
  const mockArticle = {
    title: 'Test Article Title',
    description: 'Test article description',
    url: 'https://example.com/article',
    urlToImage: 'https://example.com/image.jpg',
    publishedAt: '2024-01-15T10:00:00Z',
    source: {
      name: 'Test Source'
    }
  }

  it('renders article title correctly', () => {
    const wrapper = mount(newsCard, {
      props: {
        article: mockArticle
      }
    })

    expect(wrapper.find('h3').text()).toBe('Test Article Title')
  })

  it('renders article description', () => {
    const wrapper = mount(newsCard, {
      props: {
        article: mockArticle
      }
    })

    expect(wrapper.text()).toContain('Test article description')
  })

  it('displays article image when urlToImage is provided', () => {
    const wrapper = mount(newsCard, {
      props: {
        article: mockArticle
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockArticle.urlToImage)
    expect(img.attributes('alt')).toBe(mockArticle.title)
  })

  it('shows fallback icon when no image is provided', () => {
    const articleWithoutImage = { ...mockArticle, urlToImage: null }
    const wrapper = mount(newsCard, {
      props: {
        article: articleWithoutImage
      }
    })

    const icon = wrapper.find('[data-testid="fallback-icon"]')
    expect(icon.exists()).toBe(true)
  })

  it('renders source name', () => {
    const wrapper = mount(newsCard, {
      props: {
        article: mockArticle
      }
    })

    expect(wrapper.text()).toContain('Test Source')
  })

  it('formats published date correctly', () => {
    const wrapper = mount(newsCard, {
      props: {
        article: mockArticle
      }
    })

    // Check that some date is rendered (exact format may vary)
    expect(wrapper.text()).toMatch(/\d+ (second|minute|hour|day|month|year)s? ago/)
  })

  it('opens article link in new tab when clicked', () => {
    const wrapper = mount(newsCard, {
      props: {
        article: mockArticle
      }
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe(mockArticle.url)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('handles missing description gracefully', () => {
    const articleWithoutDesc = { ...mockArticle, description: null }
    const wrapper = mount(newsCard, {
      props: {
        article: articleWithoutDesc
      }
    })

    expect(wrapper.html()).toBeTruthy()
    expect(() => wrapper.vm).not.toThrow()
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(newsCard, {
      props: {
        article: mockArticle
      }
    })

    expect(wrapper.classes()).toContain('card')
  })
})
