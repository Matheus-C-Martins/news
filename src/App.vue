<template>
  <div id="app">
    <navbar />
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <suspense>
          <template #default>
            <component :is="Component" :key="route.path" />
          </template>
          <template #fallback>
            <RouteLoader />
          </template>
        </suspense>
      </transition>
    </router-view>
  </div>
</template>

<script>
import navbar from './components/navbar.vue'
import RouteLoader from './components/RouteLoader.vue'

export default {
  name: 'App',
  components: {
    navbar,
    RouteLoader
  }
}
</script>

<style>
/* Fade transition for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}
</style>
