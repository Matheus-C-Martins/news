import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/home.vue'
import Entertainment from './components/entertainment.vue'
import Sports from './components/sports.vue'
import Science from './components/science.vue'
import Technology from './components/technology.vue'
import Business from './components/business.vue'
import Settings from './components/settings.vue'

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