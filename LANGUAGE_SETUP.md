# NewsHub Language & Sources System

## Overview

The app now supports **6 languages** with per-language news sources:
- 🇺🇸 English (en)
- 🇵🇹 Português (pt)
- 🇪🇸 Español (es)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)

When users change the language in Settings, the available news sources automatically update to match that language.

---

## Architecture

### Files Created

1. **`src/services/languages.js`**
   - Core language configuration
   - Per-language news sources
   - Helper functions for language/source management

2. **`src/services/newsApi.js`**
   - Language-aware NewsAPI service
   - Automatically includes user's language in API requests
   - Respects selected sources

3. **`src/components/settings.vue`** (Updated)
   - Language selector
   - Per-language source selection
   - Dark mode toggle

4. **`src/App.vue`** (Updated)
   - Provides language state to all components
   - Re-renders views when language changes

### Data Flow

```
User selects language in Settings
        ↓
 localStorage.appLanguage = 'pt'
        ↓
 App.vue detects change, updates currentLanguage
        ↓
 Router-view re-renders with :key="currentLanguage"
        ↓
 Views call newsApi service
        ↓
 newsApi.js reads currentLanguage from localStorage
        ↓
 Adds language param to NewsAPI request
        ↓
 Returns articles in selected language
```

---

## How to Use in Your Views

### Option 1: Using the NewsAPI Service (Recommended)

```vue
<script setup>
import { onMounted, ref } from 'vue'
import { fetchTopHeadlines, searchNews, getAvailableSources } from '@/services/newsApi'

const articles = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    // Fetch top headlines - automatically uses current language
    const response = await fetchTopHeadlines({
      category: 'technology',
      pageSize: 20
    })
    articles.value = response.articles
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

// Search news in current language
const searchArticles = async (query) => {
  loading.value = true
  try {
    const response = await searchNews({
      q: query,
      sortBy: 'publishedAt',
      pageSize: 20
    })
    articles.value = response.articles
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
```

### Option 2: Direct Language Access

```vue
<script setup>
import { computed, inject } from 'vue'
import { LANGUAGES, getSourcesByLanguage } from '@/services/languages'

// Get current language from App.vue provider
const currentLanguage = inject('currentLanguage')

// Get language info
const languageInfo = computed(() => LANGUAGES[currentLanguage.value])

// Get available sources for current language
const availableSources = computed(() => 
  getSourcesByLanguage(currentLanguage.value)
)

// Access in template
// <p>Current language: {{ languageInfo.name }}</p>
</script>
```

---

## API Service Functions

### `fetchTopHeadlines(options)`

Fetch top headlines with language and source filtering.

```javascript
const response = await fetchTopHeadlines({
  category: 'technology',      // Optional: news category
  language: 'pt',               // Optional: override current language
  pageSize: 20,                 // Optional: results per page (default: 20)
  page: 1                        // Optional: page number
})

// Response format:
// {
//   status: 'ok',
//   totalResults: 123,
//   articles: [...]
// }
```

### `searchNews(options)`

Search for news with language support.

```javascript
const response = await searchNews({
  q: 'climate change',          // Required: search query
  language: 'es',               // Optional: override current language
  sortBy: 'publishedAt',        // Optional: 'relevancy', 'popularity', 'publishedAt'
  pageSize: 20,                 // Optional: results per page
  page: 1                        // Optional: page number
})
```

### `getAvailableSources(language)`

Get list of sources for a language.

```javascript
import { getAvailableSources } from '@/services/newsApi'

const ptSources = getAvailableSources('pt')
const currentSources = getAvailableSources() // Uses current language
```

### `getSelectedSources(language)`

Get user's selected sources for a language.

```javascript
import { getSelectedSources } from '@/services/newsApi'

const userSources = getSelectedSources('pt')
const currentSources = getSelectedSources() // Uses current language
```

### `getCurrentLanguageInfo()`

Get detailed info about current language.

```javascript
import { getCurrentLanguageInfo } from '@/services/newsApi'

const langInfo = getCurrentLanguageInfo()
// Returns: { code: 'en', name: 'English', flag: '🇺🇸', apiLanguage: 'en', ... }
```

---

## localStorage Keys

The system uses these localStorage keys:

| Key | Format | Example |
|-----|--------|----------|
| `appLanguage` | string | `'pt'` |
| `isDarkMode` | string (boolean) | `'true'` |
| `selectedNewsSourcesByLanguage` | JSON object | `{"en": ["bbc-news", "cnn"], "pt": ["globo"]}` |

---

## Example: Complete View

```vue
<template>
  <div class="news-view">
    <h1>{{ title }} News</h1>
    
    <div v-if="loading" class="loading">
      Loading articles...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="articles-grid">
      <article 
        v-for="article in articles" 
        :key="article.url"
        class="article-card"
      >
        <img 
          v-if="article.urlToImage" 
          :src="article.urlToImage" 
          :alt="article.title"
          class="article-image"
        />
        <h2>{{ article.title }}</h2>
        <p>{{ article.description }}</p>
        <a :href="article.url" target="_blank" rel="noopener">Read more →</a>
      </article>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { fetchTopHeadlines } from '@/services/newsApi'
import { LANGUAGES, getCurrentLanguage } from '@/services/languages'

const props = defineProps({
  category: String
})

const articles = ref([])
const loading = ref(false)
const error = ref(null)
const currentLanguage = ref('en')

const title = computed(() => {
  const lang = LANGUAGES[currentLanguage.value]
  return lang ? lang.name : 'News'
})

onMounted(async () => {
  currentLanguage.value = getCurrentLanguage()
  
  loading.value = true
  try {
    const response = await fetchTopHeadlines({
      category: props.category || 'general',
      pageSize: 12
    })
    articles.value = response.articles || []
  } catch (err) {
    error.value = err.message || 'Failed to load articles'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.news-view {
  max-width: 1200px;
  margin: 0 auto;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.article-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #dc2626;
  background: #fee2e2;
  border-radius: 8px;
}
</style>
```

---

## Features

✅ **Automatic Language Detection**
- Falls back to browser language on first visit
- Persists in localStorage

✅ **Per-Language Sources**
- Each language has curated news sources
- Users can select which sources they prefer
- Selections persist separately for each language

✅ **API Integration**
- Language automatically sent to NewsAPI
- Selected sources automatically filtered in requests
- Clean service layer abstraction

✅ **Reactive Components**
- Views re-render when language changes
- Settings page shows available sources for current language
- All data properly synced across components

---

## Adding More Languages

1. Add language config to `src/services/languages.js` in `LANGUAGES` object:
```javascript
jp: {
  code: 'jp',
  name: '日本語',
  flag: '🇯🇵',
  apiLanguage: 'ja',
  countries: ['jp'],
  defaultCountry: 'jp'
}
```

2. Add sources to `SOURCE_BY_LANGUAGE`:
```javascript
jp: [
  { id: 'nikkei', name: 'Nikkei', category: 'Business', ... },
  // ... more sources
]
```

3. The settings page will automatically show the new language!

---

## Testing

1. **Test Language Switching**
   - Go to Settings
   - Click different languages
   - Verify sources list updates
   - Check localStorage changes

2. **Test Source Selection**
   - Select sources in current language
   - Switch to different language
   - Switch back - selections should persist

3. **Test API Integration**
   - Open browser DevTools → Network
   - Fetch headlines
   - Verify `language=pt` (or selected language) in API request
   - Verify `sources=source1,source2` in request

---

## Troubleshooting

**Q: News sources not updating when language changes?**
A: Make sure your view has `:key="currentLanguage"` on router-view or component, or watch the language change manually.

**Q: API request not including language?**
A: Check that `VITE_NEWS_API_KEY` is set in `.env` file.

**Q: Sources not being filtered?**
A: Verify selected sources are saved in localStorage under `selectedNewsSourcesByLanguage` key.

---

## Next Steps

1. Update your existing views to use `fetchTopHeadlines()` and `searchNews()`
2. Test language switching in different views
3. Verify NewsAPI requests include language parameter
4. Consider adding UI indicators for current language/sources
