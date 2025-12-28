import { createRouter, createWebHistory } from 'vue-router'

// Page Components
import Home from './pages/Home.vue'
import Entertainment from './pages/Entertainment.vue'
import Sports from './pages/Sports.vue'
import Science from './pages/Science.vue'
import Technology from './pages/Technology.vue'
import Business from './pages/Business.vue'
import Settings from './pages/Settings.vue'

const BASE_URL = '/news'

const routes = [
  {
    path: BASE_URL,
    name: 'Home',
    component: Home
  },
  {
    path: `${BASE_URL}/entertainment`,
    name: 'Entertainment',
    component: Entertainment
  },
  {
    path: `${BASE_URL}/sports`,
    name: 'Sports',
    component: Sports
  },
  {
    path: `${BASE_URL}/science`,
    name: 'Science',
    component: Science
  },
  {
    path: `${BASE_URL}/technology`,
    name: 'Technology',
    component: Technology
  },
  {
    path: `${BASE_URL}/business`,
    name: 'Business',
    component: Business
  },
  {
    path: `${BASE_URL}/settings`,
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router