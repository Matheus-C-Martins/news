import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/home.vue'
import Shows from './components/shows.vue'
import Sports from './components/sports.vue'
import Weather from './components/weather.vue'
import Technology from './components/technology.vue'
import Finance from './components/finance.vue'
import Settings from './components/settings.vue'

const BASE_URL = '/news'

const routes = [
  {
    path: BASE_URL,
    name: 'Home',
    component: Home
  },
  {
    path: `${BASE_URL}/shows`,
    name: 'Shows',
    component: Shows
  },
  {
    path: `${BASE_URL}/sports`,
    name: 'Sports',
    component: Sports
  },
  {
    path: `${BASE_URL}/weather`,
    name: 'Weather',
    component: Weather
  },
  {
    path: `${BASE_URL}/technology`,
    name: 'Technology',
    component: Technology
  },
  {
    path: `${BASE_URL}/finance`,
    name: 'Finance',
    component: Finance
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