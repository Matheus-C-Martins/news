# Testing Guide

This project uses **Vitest** and **Vue Test Utils** for testing.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

## Test Structure

```
tests/
├── setup.js                    # Global test configuration
├── components/                 # Component tests
│   ├── newsCard.spec.js
│   ├── navbar.spec.js
│   └── ...
├── services/                   # Service/API tests
│   └── newsApi.spec.js
├── composables/                # Composable tests
│   └── useSettings.spec.js
└── utils/                      # Utility function tests
```

## Writing Tests

### Component Tests

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test Title'
      }
    })

    expect(wrapper.find('h1').text()).toBe('Test Title')
  })
})
```

### Service Tests

```javascript
import { describe, it, expect, vi } from 'vitest'
import { myApiFunction } from '@/services/api'

describe('API Service', () => {
  it('fetches data successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' })
    })

    const result = await myApiFunction()
    expect(result.data).toBe('test')
  })
})
```

### Composable Tests

```javascript
import { describe, it, expect } from 'vitest'
import { useMyComposable } from '@/composables/useMyComposable'

describe('useMyComposable', () => {
  it('returns correct values', () => {
    const { value, increment } = useMyComposable()
    
    expect(value.value).toBe(0)
    increment()
    expect(value.value).toBe(1)
  })
})
```

## Coverage Goals

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 80%
- **Statements:** 80%

## Mocking

### Mocking fetch

```javascript
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' })
})
```

### Mocking localStorage

```javascript
localStorage.setItem('key', 'value')
expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value')
```

### Mocking Vue Router

```javascript
const wrapper = mount(Component, {
  global: {
    mocks: {
      $router: {
        push: vi.fn()
      }
    }
  }
})
```

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests focused and simple**
4. **Mock external dependencies**
5. **Test edge cases and error handling**
6. **Aim for high coverage but prioritize critical paths**

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Before deployment

Failing tests will block the merge/deployment.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
