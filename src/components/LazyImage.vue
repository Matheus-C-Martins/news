<template>
  <div class="lazy-image-wrapper" :class="wrapperClass">
    <!-- Placeholder skeleton -->
    <div v-if="loading" class="image-skeleton" :style="skeletonStyle">
      <div class="skeleton-shimmer"></div>
    </div>

    <!-- Actual image -->
    <img
      v-show="!loading"
      ref="imageRef"
      :data-src="optimizedSrc"
      :alt="alt"
      :class="['lazy-image', imageClass, { loaded: imageLoaded }]"
      :style="imageStyle"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- Error fallback -->
    <div v-if="error" class="image-error" :style="skeletonStyle">
      <fa icon="fa-solid fa-image" class="error-icon" />
      <p class="error-text">Failed to load image</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image'
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  aspectRatio: {
    type: String,
    default: '16/9' // Default aspect ratio
  },
  objectFit: {
    type: String,
    default: 'cover' // cover, contain, fill, none, scale-down
  },
  placeholder: {
    type: String,
    default: null // Optional low-res placeholder
  },
  lazy: {
    type: Boolean,
    default: true
  },
  rootMargin: {
    type: String,
    default: '50px' // Start loading 50px before entering viewport
  },
  wrapperClass: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: ''
  }
})

const imageRef = ref(null)
const loading = ref(true)
const imageLoaded = ref(false)
const error = ref(false)
let observer = null

// Optimize image URL (could add query params for different sizes)
const optimizedSrc = computed(() => {
  if (!props.src) return ''
  
  // For external URLs, return as-is (NewsAPI images)
  // In production, you might use an image CDN/proxy here
  return props.src
})

const skeletonStyle = computed(() => {
  const style = {
    aspectRatio: props.aspectRatio
  }
  
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return style
})

const imageStyle = computed(() => {
  return {
    objectFit: props.objectFit
  }
})

const loadImage = () => {
  if (!imageRef.value || !props.src) return
  
  const img = imageRef.value
  const src = img.getAttribute('data-src')
  
  if (src) {
    img.src = src
    img.removeAttribute('data-src')
  }
}

const onImageLoad = () => {
  loading.value = false
  imageLoaded.value = true
  error.value = false
}

const onImageError = () => {
  loading.value = false
  imageLoaded.value = false
  error.value = true
}

onMounted(() => {
  if (!props.lazy || !('IntersectionObserver' in window)) {
    // Load immediately if lazy loading disabled or not supported
    loadImage()
    return
  }
  
  // Setup Intersection Observer for lazy loading
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage()
          if (observer && imageRef.value) {
            observer.unobserve(imageRef.value)
          }
        }
      })
    },
    {
      rootMargin: props.rootMargin,
      threshold: 0.01
    }
  )
  
  if (imageRef.value) {
    observer.observe(imageRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer && imageRef.value) {
    observer.unobserve(imageRef.value)
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
}

.lazy-image {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
}

.lazy-image.loaded {
  opacity: 1;
}

/* Skeleton loader */
.image-skeleton {
  width: 100%;
  position: relative;
  background: linear-gradient(
    90deg,
    rgba(156, 163, 175, 0.1) 0%,
    rgba(156, 163, 175, 0.2) 50%,
    rgba(156, 163, 175, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  overflow: hidden;
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  animation: shimmer-move 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes shimmer-move {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

/* Error state */
.image-error {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
  color: #6b7280;
}

.error-icon {
  font-size: 3rem;
  opacity: 0.3;
  margin-bottom: 0.5rem;
}

.error-text {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.6;
}

/* Dark mode support */
:root.dark-mode .lazy-image-wrapper {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
}

:root.dark-mode .image-skeleton {
  background: linear-gradient(
    90deg,
    rgba(75, 85, 99, 0.2) 0%,
    rgba(75, 85, 99, 0.3) 50%,
    rgba(75, 85, 99, 0.2) 100%
  );
}

:root.dark-mode .image-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.08) 100%);
  color: #9ca3af;
}
</style>
