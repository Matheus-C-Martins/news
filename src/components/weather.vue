<template>
  <main id="weather-page" class="news-container">
    <div class="header">
      <h1><fa icon="fa-solid fa-cloud" /> Weather News</h1>
      <p class="subtitle">Climate and weather-related news and updates</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading weather articles...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <fa icon="fa-solid fa-exclamation-triangle" class="error-icon" />
      <h3>Oops! Something went wrong</h3>
      <p>{{ error }}</p>
      <button @click="retryFetch" class="btn btn-primary">
        <fa icon="fa-solid fa-refresh" /> Try Again
      </button>
    </div>
    
    <!-- No Results State -->
    <div v-else-if="articles.length === 0" class="no-results">
      <fa icon="fa-solid fa-inbox" class="no-results-icon" />
      <h3>No articles found</h3>
      <p>Check back later for more weather news</p>
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
      <button @click="previousPage" :disabled="currentPage === 1" class="btn btn-secondary">
        <fa icon="fa-solid fa-chevron-left" /> Previous
      </button>
      <div class="page-info">Page <span>{{ currentPage }}</span> of <span>{{ totalPages }}</span></div>
      <button @click="nextPage" :disabled="currentPage >= totalPages" class="btn btn-secondary">
        Next <fa icon="fa-solid fa-chevron-right" />
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NewsCard from './newsCard.vue'
import { searchNews } from '../services/newsApi'

const articles = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalResults = ref(0)
const pageSize = 20

const totalPages = computed(() => Math.ceil(totalResults.value / pageSize))

const loadArticles = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const data = await searchNews({
      q: 'weather climate',
      page: currentPage.value,
      pageSize
    })
    
    if (data.articles) {
      articles.value = data.articles
      totalResults.value = Math.min(data.totalResults || 0, 100)
    }
  } catch (err) {
    console.error('Error loading weather articles:', err)
    error.value = err.message || 'Failed to fetch weather articles.'
    articles.value = []
  } finally {
    isLoading.value = false
  }
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
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: 800;
      letter-spacing: -1px;
      
      fa {
        color: var(--primary);
        font-size: 2.3rem;
      }
    }
    
    .subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      margin: 0;
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
    }
    
    .page-info {
      color: var(--text-primary);
      font-weight: 600;
      white-space: nowrap;
      
      span {
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
        font-size: 1.5rem;
        gap: 0.5rem;
        
        fa {
          font-size: 1.3rem;
        }
      }
      
      .subtitle {
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