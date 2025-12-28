<template>
  <div class="app" :class="{ 'dark-mode': isDarkMode }">
    <Sidebar :is-dark="isDarkMode" @toggle-dark-mode="toggleDarkMode" />
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './components/sidebar.vue'

// Dark mode state
const isDarkMode = ref(false)

// Initialize dark mode from localStorage
onMounted(() => {
  const savedMode = localStorage.getItem('isDarkMode')
  if (savedMode !== null) {
    isDarkMode.value = savedMode === 'true'
    applyDarkMode(isDarkMode.value)
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDark
    applyDarkMode(prefersDark)
  }
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('isDarkMode', isDarkMode.value)
  applyDarkMode(isDarkMode.value)
}

const applyDarkMode = (isDark) => {
  const html = document.documentElement
  if (isDark) {
    html.classList.add('dark-mode')
  } else {
    html.classList.remove('dark-mode')
  }
}
</script>

<style lang="scss">
  :root {
    // Light mode colors (default)
    --primary: #4ade80;
    --primary-alt: #22c55e;
    --grey: #64748b;
    --dark: #1e293b;
    --dark-alt: #334155;
    --light: #f1f5f9;
    --sidebar-width: 300px;
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --border-color: rgba(30, 41, 59, 0.1);
  }

  // Dark mode colors
  html.dark-mode {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --border-color: rgba(255, 255, 255, 0.1);
    --primary: #4ade80;
    --grey: #94a3b8;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Fira sans', sans-serif;
  }

  body {
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
  }

  .app {
    display: flex;
    min-height: 100vh;
    background: var(--bg-primary);
    transition: background-color 0.3s ease;

    main {
      flex: 1 1 0;
      padding: 2rem;
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: background-color 0.3s ease, color 0.3s ease;

      @media (max-width: 1024px) {
        padding-left: 6rem;
      }

      @media (max-width: 640px) {
        padding: 1rem;
      }
    }
  }

  // Global styles for cards and components
  .card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
  }

  .button-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--light);
    }
  }

  // Scrollbar styling for dark mode
  html.dark-mode {
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #0f172a;
    }

    ::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;

      &:hover {
        background: #475569;
      }
    }
  }
</style>