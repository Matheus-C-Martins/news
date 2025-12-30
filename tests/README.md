# 🧪 Testing Guide

Comprehensive testing guide for NewsHub application.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Coverage](#coverage)
- [CI/CD Integration](#cicd-integration)

---

## Quick Start

```bash
# Install dependencies (includes test dependencies)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

---

## Test Structure

```
tests/
├── setup.js                    # Global test setup
├── unit/                       # Unit tests
│   ├── components/             # Component tests
│   │   ├── newsCard.spec.js
│   │   ├── navbar.spec.js
│   │   └── home.spec.js
│   ├── services/               # Service tests
│   │   └── newsApi.spec.js
│   └── composables/            # Composables tests
│       └── useSettings.spec.js
└── e2e/                        # E2E tests (future)
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Run specific test file
npm test newsCard.spec.js

# Run tests matching pattern
npm test -- --grep="newsCard"
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html
```

### UI Mode

```bash
# Launch Vitest UI
npm run test:ui
```

Opens interactive UI at `http://localhost:51204`

---

## Writing Tests

### Component Tests

**Example: Testing newsCard component**

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import newsCard from '@/components/newsCard.vue'

describe('newsCard.vue', () => {
  const mockArticle = {
    title: 'Test Title',
    description: 'Test description',
    url: 'https://example.com',
    source: { name: 'Test Source' },
  }

  it('renders article title', () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    expect(wrapper.text()).toContain('Test Title')
  })

  it('emits click event', async () => {
    const wrapper = mount(newsCard, {
      props: { article: mockArticle },
    })
    await wrapper.find('a').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### Service Tests

**Example: Testing API service**

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchTopHeadlines } from '@/services/newsApi.js'

describe('newsApi.js', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('fetches articles successfully', async () => {
    const mockData = {
      status: 'ok',
      articles: [{ title: 'Article 1' }],
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    })

    const result = await fetchTopHeadlines({ page: 1 })
    expect(result.articles).toHaveLength(1)
  })

  it('handles errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    await expect(fetchTopHeadlines({ page: 1 })).rejects.toThrow()
  })
})
```

### Composables Tests

**Example: Testing useSettings**

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes dark mode from localStorage', async () => {
    localStorage.setItem('darkMode', 'true')
    const { isDarkMode } = await import('@/composables/useSettings.js')
    expect(isDarkMode.value).toBe(true)
  })
})
```

---

## Coverage

### Coverage Thresholds

**Minimum required coverage: 80%**

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 80%
- **Statements:** 80%

### Checking Coverage

```bash
# Run tests with coverage
npm run test:coverage

# Coverage summary in terminal
# Detailed report in coverage/index.html
```

### Coverage Reports

| Format | Location | Purpose |
|--------|----------|----------|
| **HTML** | `coverage/index.html` | Interactive browser view |
| **LCOV** | `coverage/lcov.info` | CI/CD integration |
| **JSON** | `coverage/coverage-final.json` | Programmatic access |
| **Text** | Terminal output | Quick overview |

---

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- ✅ Push to `main` or `develop`
- ✅ Pull requests
- ✅ Manual workflow dispatch

**Workflow:** `.github/workflows/test.yml`

### Test Matrix

Tests run on multiple Node.js versions:
- Node.js 18.x
- Node.js 20.x

### Artifacts

- **Coverage reports** uploaded to CodeCov
- **HTML reports** archived for 30 days
- **PR comments** with coverage summary

---

## Best Practices

### ✅ DO

- Write tests for new features
- Test edge cases and error scenarios
- Mock external dependencies (API calls, localStorage)
- Keep tests fast and isolated
- Use descriptive test names
- Aim for 80%+ coverage
- Test user interactions
- Test component props and events

### ❌ DON'T

- Test implementation details
- Write slow tests
- Skip error handling tests
- Test third-party library internals
- Make tests dependent on each other
- Hardcode test data when avoidable
- Ignore flaky tests

---

## Mocking

### Mocking fetch

```javascript
import { vi } from 'vitest'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
  })
)
```

### Mocking localStorage

```javascript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock
```

### Mocking Vue Router

```javascript
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
}

const wrapper = mount(Component, {
  global: {
    mocks: {
      $router: mockRouter,
    },
  },
})
```

---

## Debugging Tests

### Debug Single Test

```bash
# Run specific test in watch mode
npm run test:watch -- newsCard.spec.js
```

### Debug with console.log

```javascript
it('debugs component', () => {
  const wrapper = mount(Component)
  console.log(wrapper.html())  // Output component HTML
  console.log(wrapper.vm)      // Output component instance
})
```

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:debug"],
  "console": "integratedTerminal"
}
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
- [Vitest UI](https://vitest.dev/guide/ui.html)
- [Coverage Reports](https://vitest.dev/guide/coverage.html)

---

## Troubleshooting

### Tests failing with "Cannot find module"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Coverage not generating

```bash
# Install coverage provider
npm install -D @vitest/coverage-v8
```

### Tests timing out

Increase timeout in `vitest.config.js`:

```javascript
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
})
```

---

**Happy Testing!** 🧪 ✨