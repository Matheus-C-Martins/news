import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/home.vue'
import Shows from './components/shows.vue'
import Sports from './components/sports.vue'
import Weather from './components/weather.vue'
import Technology from './components/technology.vue'
import Finance from './components/finance.vue'
import Settings from './components/settings.vue'

const baseURL = '/news'

const routes=[
    {
        name:'Home',
        component: Home,
        path: baseURL
    },
    {
        name:'Science',
        component: Weather,
        path: baseURL+'/science'
    },
    {
        name:'Sports',
        component: Sports,
        path: baseURL+'/sports'
    },
    {
        name:'Technology',
        component: Technology,
        path: baseURL+'/technology'
    },
    {
        name:'Entertainment',
        component: Shows,
        path: baseURL+'/entertainment'
    },
    {
        name:'Business',
        component: Finance,
        path: baseURL+'/business'
    },
    {
        name:'Settings',
        component: Settings,
        path: baseURL+'/settings'
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
