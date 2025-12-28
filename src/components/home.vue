<template>
  <main id="home-page" class="news-container">
    <div class="header">
      <h1>All News</h1>
      <p class="subtitle">Stay updated with the latest headlines</p>
    </div>
    
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-wrapper">
        <fa icon="fa-solid fa-search" class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search news..."
          class="search-input"
          @keyup.enter="performSearch"
        />
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading articles...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <fa icon="fa-solid fa-exclamation-triangle" class="error-icon" />
      <h3>Oops! Something went wrong</h3>
      <p>{{ error }}</p>
      <p v-if="error.includes('API_KEY')">Please set your NewsAPI key in <code>src/services/newsService.js</code></p>
      <button @click="retryFetch" class="retry-button">
        <fa icon="fa-solid fa-refresh" /> Try Again
      </button>
    </div>
    
    <!-- No Results State -->
    <div v-else-if="articles.length === 0" class="no-results">
      <fa icon="fa-solid fa-inbox" class="no-results-icon" />
      <h3>No articles found</h3>
      <p>Try a different search or check back later</p>
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
      error.value = data.message || 'Failed to fetch articles. Make sure your API key is set correctly.'
      articles.value = []
    } else if (data.articles) {
      articles.value = data.articles
      totalResults.value = Math.min(data.totalResults, 100) // API limits to 100 results
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
      color: var(--dark);
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      font-size: 1.1rem;
      color: var(--grey);
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
        color: var(--grey);
        pointer-events: none;
      }
      
      .search-input {
        width: 100%;
        padding: 12px 16px 12px 40px;
        font-size: 1rem;
        border: 2px solid var(--light);
        border-radius: 8px;
        background: white;
        transition: all 0.3s ease;
        
        &:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
        }
        
        &::placeholder {
          color: var(--grey);
        }
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
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    p {
      color: var(--grey);
      margin: 0.5rem 0 0 0;
    }
    
    code {
      background: var(--dark-alt);
      color: var(--light);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
  }
  
  .loading-state {
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--light);
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
      color: var(--dark);
      margin-bottom: 1rem;
    }
    
    h3 {
      color: var(--dark);
      margin: 0;
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
    background: linear-gradient(135deg, var(--light), white);
    
    .no-results-icon {
      font-size: 4rem;
      color: var(--grey);
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    
    h3 {
      color: var(--dark);
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
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
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
        background: var(--light);
        color: var(--grey);
        cursor: not-allowed;
        opacity: 0.5;
      }
      
      fa {
        font-size: 0.9rem;
      }
    }
    
    .page-info {
      color: var(--dark);
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