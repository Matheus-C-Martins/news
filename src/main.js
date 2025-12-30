import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import global CSS variables for theming
import './assets/styles/variables.css'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas, far, fab)

createApp(App).use(router).component("fa", FontAwesomeIcon).mount('#app')
