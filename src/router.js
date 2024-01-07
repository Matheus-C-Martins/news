import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/home.vue'
import Shows from './components/shows.vue'
import Sports from './components/sports.vue'
import Weather from './components/weather.vue'
import Settings from './components/settings.vue'
import Technology from './components/technology.vue'

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
    },{
        name:'Settings',
        component: Settings,
        path: '/settings'
    },
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router