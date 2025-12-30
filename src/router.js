import { createRouter, createWebHistory } from 'vue-router'

const BASE_URL = '/news'

// Lazy load components for better performance
// Each route will be split into separate chunks
const routes = [
  {
    path: BASE_URL,
    name: 'Home',
    component: () => import('./components/home.vue'),
    meta: {
      title: 'Home - NewsHub',
      prefetch: true // Prefetch this route
    }
  },
  {
    path: `${BASE_URL}/shows`,
    name: 'Shows',
    component: () => import('./components/shows.vue'),
    meta: {
      title: 'Entertainment - NewsHub'
    }
  },
  {
    path: `${BASE_URL}/sports`,
    name: 'Sports',
    component: () => import('./components/sports.vue'),
    meta: {
      title: 'Sports - NewsHub'
    }
  },
  {
    path: `${BASE_URL}/weather`,
    name: 'Weather',
    component: () => import('./components/weather.vue'),
    meta: {
      title: 'Science - NewsHub'
    }
  },
  {
    path: `${BASE_URL}/technology`,
    name: 'Technology',
    component: () => import('./components/technology.vue'),
    meta: {
      title: 'Technology - NewsHub'
    }
  },
  {
    path: `${BASE_URL}/finance`,
    name: 'Finance',
    component: () => import('./components/finance.vue'),
    meta: {
      title: 'Business - NewsHub'
    }
  },
  {
    path: `${BASE_URL}/settings`,
    name: 'Settings',
    component: () => import('./components/settings.vue'),
    meta: {
      title: 'Settings - NewsHub'
    }
  },
  {
    // Catch-all redirect to home
    path: '/:pathMatch(.*)*',
    redirect: BASE_URL
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top on route change, or restore position
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Update document title on route change
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'NewsHub'
  next()
})

// Handle chunk load errors (e.g., after deployment)
router.onError((error) => {
  if (/loading chunk \d* failed./i.test(error.message)) {
    // Reload the page to get the new chunk
    window.location.reload()
  }
})

export default router
