<template>
  <article class="news-card card">
    <div class="card-image-wrapper">
      <LazyImage
        v-if="article.urlToImage && isHttpsUrl(article.urlToImage)"
        :src="article.urlToImage"
        :alt="article.title"
        aspect-ratio="16/9"
        object-fit="cover"
        wrapper-class="card-image-container"
        image-class="card-image"
      />
      <div v-else class="card-image-placeholder">
        <fa icon="fa-solid fa-image" class="placeholder-icon" data-testid="fallback-icon" />
      </div>
      <div class="card-source">
        <span class="badge badge-small">{{ article.source.name }}</span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ article.title }}</h3>
      
      <p class="card-description">{{ truncateText(article.description, 100) }}</p>
      
      <div class="card-meta">
        <span class="meta-author" v-if="article.author">
          <fa icon="fa-solid fa-user" /> {{ truncateText(article.author, 30) }}
        </span>
        <span class="meta-date">
          <fa icon="fa-solid fa-clock" /> {{ formatDate(article.publishedAt) }}
        </span>
      </div>
      
      <a 
        :href="article.url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="btn btn-primary btn-sm"
      >
        Read Article
        <fa icon="fa-solid fa-arrow-right" />
      </a>
    </div>
  </article>
</template>

<script setup>
import { defineProps } from 'vue'
import LazyImage from './LazyImage.vue'

defineProps({
  article: {
    type: Object,
    required: true
  }
})

// SECURITY FIX: Validate HTTPS URLs
const isHttpsUrl = (url) => {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:'
  } catch (error) {
    console.warn('Invalid image URL:', url)
    return false
  }
}

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
  const diffSeconds = Math.floor(diffTime / 1000)
  
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  
  const years = Math.floor(diffDays / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}
</script>

<style lang="scss" scoped>
.news-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.6));
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  
  html.dark-mode & {
    background: rgba(30, 41, 59, calc(var(--glass-opacity) * 1.2));
  }
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-6px);
    border-color: var(--primary);
  }
  
  .card-image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, var(--primary-light) 0%, rgba(16, 185, 129, 0.1) 100%);
    
    .card-image-container {
      width: 100%;
      height: 100%;
      
      :deep(.card-image) {
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .news-card:hover & :deep(.card-image.loaded) {
        transform: scale(1.08);
      }
    }
    
    .card-image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-light) 0%, rgba(139, 92, 246, 0.08) 100%);
      
      .placeholder-icon {
        font-size: 3.5rem;
        color: var(--primary);
        opacity: 0.5;
      }
    }
    
    .card-source {
      position: absolute;
      bottom: 12px;
      left: 12px;
      z-index: 2;
      
      .badge-small {
        font-size: 0.7rem;
        padding: 0.35rem 0.75rem;
        background: rgba(15, 23, 42, 0.9);
        color: white;
        border: none;
        backdrop-filter: blur(8px);
      }
    }
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 18px;
    
    .card-title {
      margin: 0 0 10px 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      letter-spacing: -0.3px;
    }
    
    .card-description {
      margin: 0 0 14px 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    
    .card-meta {
      display: flex;
      gap: 14px;
      margin-bottom: 14px;
      flex-wrap: wrap;
      font-size: 0.8rem;
      color: var(--text-secondary);
      
      .meta-author,
      .meta-date {
        display: flex;
        align-items: center;
        gap: 5px;
        
        fa {
          font-size: 0.75rem;
          color: var(--primary);
        }
      }
    }
    
    .btn {
      width: 100%;
      
      &:hover {
        gap: 12px;
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
      padding: 14px;
      
      .card-title {
        font-size: 1rem;
        margin-bottom: 8px;
      }
      
      .card-description {
        font-size: 0.85rem;
        margin-bottom: 10px;
      }
      
      .card-meta {
        font-size: 0.75rem;
        margin-bottom: 10px;
      }
    }
  }
}

@media (max-width: 640px) {
  .news-card {
    .card-image-wrapper {
      height: 140px;
    }
    
    .card-content {
      padding: 12px;
      
      .card-title {
        font-size: 0.95rem;
      }
      
      .card-description {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
