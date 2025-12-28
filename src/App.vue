<template>
  <div class="app" :class="{ 'dark-mode': isDarkMode }">
    <Navbar :is-dark="isDarkMode" />
    <main class="main-content">
      <router-view :key="routeKey" />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Navbar from './components/navbar.vue'
import { useSettings, isDarkMode, currentLanguage } from './composables/useSettings'

// Initialize settings from localStorage and provide globally
const { initializeSettings } = useSettings()
initializeSettings()

const routeKey = ref(0)

// Watch for language changes via custom event
onMounted(() => {
  window.addEventListener('languageChanged', () => {
    // Force re-render by updating the key
    routeKey.value += 1
  })
})

// Also watch the currentLanguage ref directly
watch(currentLanguage, () => {
  routeKey.value += 1
})
</script>

<style lang="scss">
  :root {
    // Light mode colors (default)
    --primary: #10b981;
    --primary-alt: #059669;
    --primary-light: #d1fae5;
    --secondary: #8b5cf6;
    --secondary-light: #ede9fe;
    --accent: #f59e0b;
    --accent-light: #fef3c7;
    --grey: #6b7280;
    --grey-light: #f3f4f6;
    --dark: #1f2937;
    --dark-alt: #111827;
    --light: #f9fafb;
    --light-alt: #f3f4f6;
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --bg-tertiary: #f3f4f6;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --border-color: rgba(31, 41, 55, 0.08);
    --border-color-alt: rgba(31, 41, 55, 0.12);
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --glass-blur: 10px;
    --glass-opacity: 0.15;
  }

  // Dark mode colors
  html.dark-mode {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --border-color: rgba(255, 255, 255, 0.06);
    --border-color-alt: rgba(255, 255, 255, 0.1);
    --primary: #10b981;
    --primary-light: #064e3b;
    --secondary: #a78bfa;
    --secondary-light: #312e81;
    --accent: #fbbf24;
    --accent-light: #78350f;
    --grey: #9ca3af;
    --grey-light: #1f2937;
    --dark: #0f172a;
    --dark-alt: #020617;
    --light: #f1f5f9;
    --light-alt: #e2e8f0;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    --glass-blur: 12px;
    --glass-opacity: 0.25;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-alt);
    }
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--bg-primary);
    transition: background-color 0.3s ease;

    main.main-content {
      flex: 1;
      padding: 2rem;
      background: 
        linear-gradient(
          135deg,
          rgba(16, 185, 129, 0.05) 0%,
          rgba(139, 92, 246, 0.05) 100%
        ),
        var(--bg-primary);
      color: var(--text-primary);
      transition: background-color 0.3s ease, color 0.3s ease;
      overflow-y: auto;
      overflow-x: hidden;
      /* Scrollbar styling */
      scrollbar-width: thin;
      scrollbar-color: var(--border-color-alt) var(--bg-primary);

      @media (max-width: 768px) {
        padding: 1.5rem 1rem;
      }

      @media (max-width: 480px) {
        padding: 1rem 0.75rem;
      }
    }
  }

  /* Chrome/Edge/Safari scrollbar styling for main content */
  main.main-content::-webkit-scrollbar {
    width: 10px;
  }

  main.main-content::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }

  main.main-content::-webkit-scrollbar-thumb {
    background: var(--border-color-alt);
    border-radius: 5px;
    transition: background 0.2s ease;

    &:hover {
      background: var(--grey);
    }
  }

  // Glassmorphism card component
  .glass-card {
    background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.6));
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-md);

    &:hover {
      border-color: var(--border-color-alt);
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
  }

  html.dark-mode .glass-card {
    background: rgba(30, 41, 59, calc(var(--glass-opacity) * 1.2));
    border-color: rgba(148, 163, 184, 0.1);

    &:hover {
      border-color: rgba(148, 163, 184, 0.2);
    }
  }

  // Card component
  .card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);

    &:hover {
      border-color: var(--border-color-alt);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    &.card--primary {
      background: linear-gradient(135deg, var(--primary-light) 0%, rgba(16, 185, 129, 0.08) 100%);
      border-color: var(--primary);

      &:hover {
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
      }
    }

    &.card--secondary {
      background: linear-gradient(135deg, var(--secondary-light) 0%, rgba(139, 92, 246, 0.08) 100%);
      border-color: var(--secondary);

      &:hover {
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
      }
    }

    &.card--accent {
      background: linear-gradient(135deg, var(--accent-light) 0%, rgba(245, 158, 11, 0.08) 100%);
      border-color: var(--accent);

      &:hover {
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
      }
    }
  }

  // Button styles
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    color: var(--text-primary);

    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    &.btn--primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

      &:hover {
        background: var(--primary-alt);
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &.btn--secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color-alt);
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: var(--bg-tertiary);
        border-color: var(--primary);
        color: var(--primary);
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &.btn--outline {
      background: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);

      &:hover {
        background: rgba(16, 185, 129, 0.1);
      }
    }

    &.btn--sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border-radius: 6px;
    }

    &.btn--lg {
      padding: 1rem 2rem;
      font-size: 1.05rem;
      border-radius: 10px;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  // Badge component
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: var(--primary-light);
    color: var(--primary);

    &.badge--secondary {
      background: var(--secondary-light);
      color: var(--secondary);
    }

    &.badge--accent {
      background: var(--accent-light);
      color: var(--accent);
    }
  }

  // Typography
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    line-height: 1.3;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1.1rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  code {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    font-size: 0.9em;
    font-family: 'Courier New', monospace;
    color: var(--accent);
  }

  pre {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin-bottom: 1.5rem;

    code {
      background: none;
      border: none;
      padding: 0;
      color: inherit;
    }
  }

  // Utility classes
  .text-center {
    text-align: center;
  }

  .text-muted {
    color: var(--text-secondary);
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .grid {
    display: grid;
    gap: 2rem;

    &.grid--2 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    &.grid--3 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    @media (max-width: 768px) {
      gap: 1.5rem;

      &.grid--2,
      &.grid--3 {
        grid-template-columns: 1fr;
      }
    }
  }

  // Animations
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .slide-in-up {
    animation: slideInUp 0.3s ease-out;
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>