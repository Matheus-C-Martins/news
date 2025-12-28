<template>
  <article class="news-card">
    <div class="card-image-wrapper">
      <img 
        v-if="article.urlToImage" 
        :src="article.urlToImage" 
        :alt="article.title"
        class="card-image"
        @error="handleImageError"
      />
      <div v-else class="card-image-placeholder">
        <fa icon="fa-solid fa-image" class="placeholder-icon" />
      </div>
      <div class="card-source">
        {{ article.source.name }}
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ article.title }}</h3>
      
      <p class="card-description">{{ truncateText(article.description, 100) }}</p>
      
      <div class="card-meta">
        <span class="meta-author" v-if="article.author">
          <fa icon="fa-solid fa-user" /> {{ article.author }}
        </span>
        <span class="meta-date">
          <fa icon="fa-solid fa-clock" /> {{ formatDate(article.publishedAt) }}
        </span>
      </div>
      
      <a 
        :href="article.url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="card-button"
      >
        Read Article
        <fa icon="fa-solid fa-arrow-right" />
      </a>
    </div>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  article: {
    type: Object,
    required: true
  }
})

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.nextElementSibling?.classList.add('show')
}
</script>

<style lang="scss" scoped>
.news-card {
  display: flex;
  flex-direction: column;
  background: var(--light);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
  
  .card-image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: var(--grey);
    
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
      
      .news-card:hover & {
        transform: scale(1.05);
      }
    }
    
    .card-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--dark-alt) 0%, var(--dark) 100%);
      
      .placeholder-icon {
        font-size: 3rem;
        color: var(--grey);
      }
    }
    
    .card-source {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      backdrop-filter: blur(4px);
    }
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 16px;
    
    .card-title {
      margin: 0 0 8px 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--dark);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-description {
      margin: 0 0 12px 0;
      font-size: 0.875rem;
      color: var(--grey);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    
    .card-meta {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      flex-wrap: wrap;
      font-size: 0.75rem;
      color: var(--grey);
      
      .meta-author,
      .meta-date {
        display: flex;
        align-items: center;
        gap: 4px;
        
        fa {
          font-size: 0.7rem;
        }
      }
    }
    
    .card-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--primary);
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid var(--primary);
      
      &:hover {
        background: var(--primary-alt);
        border-color: var(--primary-alt);
        gap: 12px;
      }
      
      fa {
        font-size: 0.75rem;
      }
    }
  }
}

@media (max-width: 1024px) {
  .news-card {
    .card-image-wrapper {
      height: 160px;
    }
    
    .card-content {
      padding: 12px;
      
      .card-title {
        font-size: 0.95rem;
        margin-bottom: 6px;
      }
      
      .card-description {
        font-size: 0.8rem;
        margin-bottom: 8px;
      }
    }
  }
}
</style>