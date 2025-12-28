<template>
  <main id="home-page" class="news-container">
    <div class="header">
      <h1>All News</h1>
      <p class="subtitle">Stay updated with the latest headlines from around the world</p>
    </div>
    
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-wrapper">
        <fa icon="fa-solid fa-search" class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search news by keywords..."
          class="search-input"
          @keyup.enter="performSearch"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-button" title="Clear search">
          <fa icon="fa-solid fa-times" />
        </button>
      </div>
      <p v-if="isSearching" class="search-hint">Searching for: <strong>{{ searchQuery }}</strong></p>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ isSearching ? 'Searching articles...' : 'Loading articles...' }}</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <fa icon="fa-solid fa-exclamation-triangle" class="error-icon" />
      <h3>Oops! Something went wrong</h3>
      <p>{{ error }}</p>
      <p v-if="error.includes('configured')" class="error-hint">📝 Create a <code>.env.local</code> file with your API key</p>
      <button @click="retryFetch" class="retry-button">
        <fa icon="fa-solid fa-refresh" /> Try Again
      </button>
    </div>
    
    <!-- No Results State -->
    <div v-else-if="articles.length === 0" class="no-results">
      <fa icon="fa-solid fa-inbox" class="no-results-icon" />
      <h3>No articles found</h3>
      <p v-if="isSearching">Try a different search term</p>
      <p v-else>Check back later for more news</p>
    </div>
    
    <!-- Articles Grid -->
    <div v-else class="articles-grid">
      <news-card 
        v-for="(article, index) in articles"
        :key="index"
        :article="article"
      />
    </div>
    
    <!-- Pagination -->
    <div v-if="totalResults > 0 && articles.length > 0" class="pagination">
      <button 
        @click="previousPage"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        <fa icon="fa-solid fa-chevron-left" /> Previous
      </button>
      
      <div class="page-info">
        Page <span class="current-page">{{ currentPage }}</span> of <span class="total-pages">{{ totalPages }}</span>
      </div>
      
      <button 
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="pagination-button"
      >
        Next <fa icon="fa-solid fa-chevron-right" />
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NewsCard from './newsCard.vue'
import { fetchNewsByCategory, searchNews } from '../services/newsService'

const articles = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const totalResults = ref(0)
const pageSize = 20
const isSearching = ref(false)

const totalPages = computed(() => Math.ceil(totalResults.value / pageSize))

const loadArticles = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    let data
    if (isSearching.value && searchQuery.value.trim()) {
      data = await searchNews(searchQuery.value, 'relevancy', currentPage.value)
    } else {
      data = await fetchNewsByCategory('general', currentPage.value)
    }
    
    if (data.status === 'error') {
      error.value = data.message || 'Failed to fetch articles. Make sure your API key is configured.'
      articles.value = []
    } else if (data.articles) {
      articles.value = data.articles
      totalResults.value = Math.min(data.totalResults, 100)
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    articles.value = []
  } finally {
    isLoading.value = false
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    isSearching.value = true
    currentPage.value = 1
    loadArticles()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  isSearching.value = false
  currentPage.value = 1
  loadArticles()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
    loadArticles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    loadArticles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const retryFetch = () => {
  loadArticles()
}

onMounted(() => {
  loadArticles()
})
</script>

<style lang="scss" scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  
  .header {
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2.5rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
    }
  }
  
  .search-section {
    margin-bottom: 2rem;
    
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      
      .search-icon {
        position: absolute;
        left: 16px;
        color: var(--text-secondary);
        pointer-events: none;
      }
      
      .search-input {
        width: 100%;
        padding: 12px 40px 12px 40px;
        font-size: 1rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
        }
        
        &::placeholder {
          color: var(--text-secondary);
        }
      }
      
      .clear-button {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        transition: color 0.2s ease;
        padding: 4px 8px;
        
        &:hover {
          color: var(--primary);
        }
      }
    }
    
    .search-hint {
      margin-top: 8px;
      font-size: 0.9rem;
      color: var(--text-secondary);
      
      strong {
        color: var(--primary);
      }
    }
  }
  
  .loading-state,
  .error-state,
  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    background: var(--bg-secondary);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    
    p {
      color: var(--text-secondary);
      margin: 0.5rem 0 0 0;
    }
    
    code {
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
      border: 1px solid var(--border-color);
    }
  }
  
  .loading-state {
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
  }
  
  .error-state {
    background: rgba(192, 21, 47, 0.05);
    border: 1px solid rgba(192, 21, 47, 0.2);
    
    .error-icon {
      font-size: 3rem;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
    
    h3 {
      color: var(--text-primary);
      margin: 0;
    }
    
    .error-hint {
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    
    .retry-button {
      margin-top: 1rem;
      background: var(--dark);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      
      &:hover {
        background: var(--dark-alt);
      }
    }
  }
  
  .no-results {
    background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary));
    
    .no-results-icon {
      font-size: 4rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    h3 {
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }
  }
  
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    
    .pagination-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover:not(:disabled) {
        background: var(--primary-alt);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(74, 222, 128, 0.2);
      }
      
      &:disabled {
        background: var(--bg-primary);
        color: var(--text-secondary);
        cursor: not-allowed;
        opacity: 0.5;
        border: 1px solid var(--border-color);
      }
      
      fa {
        font-size: 0.9rem;
      }
    }
    
    .page-info {
      color: var(--text-primary);
      font-weight: 600;
      
      .current-page,
      .total-pages {
        color: var(--primary);
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .news-container {
    .header {
      h1 {
        font-size: 2rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
    }
    
    .articles-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .pagination {
      flex-direction: column;
      gap: 1rem;
    }
  }
}

@media (max-width: 640px) {
  .news-container {
    .header {
      h1 {
        font-size: 1.5rem;
      }
    }
    
    .articles-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .pagination {
      .pagination-button {
        padding: 8px 12px;
        font-size: 0.9rem;
      }
    }
  }
}
</style>