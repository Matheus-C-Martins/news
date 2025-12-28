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
      <button @click="retryFetch" class="btn btn-primary">
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
        class="btn btn-secondary"
      >
        <fa icon="fa-solid fa-chevron-left" /> Previous
      </button>
      
      <div class="page-info">
        Page <span class="current-page">{{ currentPage }}</span> of <span class="total-pages">{{ totalPages }}</span>
      </div>
      
      <button 
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="btn btn-secondary"
      >
        Next <fa icon="fa-solid fa-chevron-right" />
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NewsCard from './newsCard.vue'
import { fetchTopHeadlines, searchNews } from '../services/newsApi'

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
      data = await searchNews({ 
        q: searchQuery.value, 
        sortBy: 'relevancy', 
        page: currentPage.value,
        pageSize
      })
    } else {
      data = await fetchTopHeadlines({ 
        page: currentPage.value,
        pageSize
      })
    }
    
    if (data.articles) {
      articles.value = data.articles
      totalResults.value = Math.min(data.totalResults || 0, 100)
    }
  } catch (err) {
    console.error('Error loading articles:', err)
    error.value = err.message || 'Failed to fetch articles. Make sure your API key is configured.'
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
    margin-bottom: 2.5rem;
    animation: slideInUp 0.5s ease-out;
    
    h1 {
      font-size: 2.5rem;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      font-weight: 800;
      letter-spacing: -1px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }
  }
  
  .search-section {
    margin-bottom: 2.5rem;
    animation: slideInUp 0.5s ease-out 0.1s both;
    
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      
      .search-icon {
        position: absolute;
        left: 16px;
        color: var(--primary);
        pointer-events: none;
        font-size: 1.1rem;
      }
      
      .search-input {
        width: 100%;
        padding: 13px 40px 13px 45px;
        font-size: 1rem;
        border: 2px solid var(--border-color);
        border-radius: 10px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        
        &:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
          background: rgba(16, 185, 129, 0.02);
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
        transition: all 0.2s ease;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          color: var(--primary);
          transform: scale(1.15);
        }
      }
    }
    
    .search-hint {
      margin-top: 10px;
      font-size: 0.9rem;
      color: var(--text-secondary);
      
      strong {
        color: var(--primary);
        font-weight: 600;
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
    padding: 5rem 2rem;
    text-align: center;
    border-radius: 14px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.6));
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    
    html.dark-mode & {
      background: rgba(30, 41, 59, calc(var(--glass-opacity) * 1.2));
    }
    
    p {
      color: var(--text-secondary);
      margin: 0.75rem 0 0 0;
    }
    
    code {
      background: var(--bg-primary);
      color: var(--primary);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
      border: 1px solid var(--border-color);
    }
  }
  
  .loading-state {
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
  }
  
  .error-state {
    background: rgba(192, 21, 47, 0.06);
    border: 1px solid rgba(192, 21, 47, 0.15);
    backdrop-filter: blur(var(--glass-blur));
    
    .error-icon {
      font-size: 3.5rem;
      color: var(--text-primary);
      margin-bottom: 1rem;
      opacity: 0.8;
    }
    
    h3 {
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
    }
    
    .error-hint {
      font-size: 0.9rem;
      margin-top: 0.75rem;
    }
  }
  
  .no-results {
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.05) 0%,
      rgba(139, 92, 246, 0.05) 100%
    );
    
    .no-results-icon {
      font-size: 4.5rem;
      color: var(--primary);
      margin-bottom: 1rem;
      opacity: 0.4;
    }
    
    h3 {
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
    }
  }
  
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 2.5rem;
    animation: fadeIn 0.5s ease-out 0.2s both;
  }
  
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2.5rem;
    border-radius: 14px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.6));
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    
    html.dark-mode & {
      background: rgba(30, 41, 59, calc(var(--glass-opacity) * 1.2));
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--text-primary);
    }
    
    .btn.btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color-alt);
      
      &:hover:not(:disabled) {
        background: var(--bg-tertiary);
        border-color: var(--primary);
        color: var(--primary);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    .page-info {
      color: var(--text-primary);
      font-weight: 600;
      white-space: nowrap;
      
      .current-page,
      .total-pages {
        color: var(--primary);
        font-weight: 700;
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .news-container {
    .header {
      margin-bottom: 2rem;
      
      h1 {
        font-size: 2rem;
      }
      
      .subtitle {
        font-size: 1.05rem;
      }
    }
    
    .articles-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .pagination {
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem;
      
      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 640px) {
  .news-container {
    .header {
      h1 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }
      
      .subtitle {
        font-size: 0.95rem;
      }
    }
    
    .search-section {
      margin-bottom: 1.5rem;
      
      .search-wrapper .search-input {
        padding: 11px 35px 11px 40px;
        font-size: 0.95rem;
      }
    }
    
    .articles-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .pagination {
      padding: 1.5rem;
      gap: 1rem;
      
      .page-info {
        order: 3;
        width: 100%;
        text-align: center;
        font-size: 0.9rem;
      }
      
      .btn {
        width: 100%;
      }
    }
  }
}
</style>