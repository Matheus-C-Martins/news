import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/home.vue'
import Shows from './components/shows.vue'
import Sports from './components/sports.vue'
import Weather from './components/weather.vue'
import Technology from './components/technology.vue'
import Finance from './components/finance.vue'
import Settings from './components/settings.vue'

const routes=[
    {
        name:'Home',
        component: Home,
        path: '/'
    },
    {
        name:'Weather',
        component: Weather,
        path: '/weather'
    },
    {
        name:'Sports',
        component: Sports,
        path: '/sports'
    },
    {
        name:'Technology',
        component: Technology,
        path: '/technology'
    },
    {
        name:'Shows',
        component: Shows,
        path: '/shows'
    },
    {
        name:'Finance',
        component: Finance,
        path: '/finance'
    },
    {
        name:'Settings',
        component: Settings,
        path: '/settings'
    },
]

const router = createRouter({
    history: createWebHistory('/news/'),
    routes
})

export default router
