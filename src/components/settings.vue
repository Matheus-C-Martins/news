<template>
  <main id="settings-page" class="settings-container">
    <div class="settings-header">
      <h1>Settings</h1>
      <p class="subtitle">Customize your news experience</p>
    </div>

    <!-- Language Settings -->
    <section class="settings-section disabled-section">
      <div class="section-header">
        <fa icon="fa-solid fa-globe" class="section-icon" />
        <h2>Language</h2>
        <span class="coming-soon-badge">Coming Soon</span>
      </div>
      <div class="settings-content">
        <p class="setting-description">Choose your preferred language for the application and news sources</p>
        <div class="disabled-overlay">
          <div class="coming-soon-message">
            <fa icon="fa-solid fa-rocket" class="rocket-icon" />
            <p>Language selection features will be available soon!</p>
            <p class="message-subtext">We're working on bringing multi-language support to NewsHub.</p>
          </div>
        </div>
        <div class="language-grid disabled">
          <button
            v-for="lang in languages"
            :key="lang.code"
            disabled
            :class="['language-btn', { active: currentLanguage === lang.code }]"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Theme Settings -->
    <section class="settings-section">
      <div class="section-header">
        <fa icon="fa-solid fa-palette" class="section-icon" />
        <h2>Appearance</h2>
      </div>
      <div class="settings-content">
        <p class="setting-description">Select your preferred color theme</p>
        <div class="theme-grid">
          <button
            @click="toggleDarkMode"
            :class="['theme-btn', { active: isDark }]"
          >
            <fa icon="fa-solid fa-moon" class="theme-icon" />
            <span>Dark Mode</span>
          </button>
          <button
            @click="toggleDarkMode"
            :class="['theme-btn', { active: !isDark }]"
          >
            <fa icon="fa-solid fa-sun" class="theme-icon" />
            <span>Light Mode</span>
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="settings-section">
      <div class="section-header">
        <fa icon="fa-solid fa-info-circle" class="section-icon" />
        <h2>About</h2>
      </div>
      <div class="settings-content">
        <div class="about-info">
          <p><strong>NewsHub</strong></p>
          <p>Version 1.0.0</p>
          <p class="about-description">Your personal news aggregator powered by NewsAPI</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  LANGUAGES,
  getCurrentLanguage
  // setLanguage - Currently disabled as language selection feature is coming soon
} from '../services/languages'

const isDark = ref(false)
const currentLanguage = ref('en')

const languages = Object.values(LANGUAGES)

onMounted(() => {
  // Load dark mode preference
  const savedMode = localStorage.getItem('isDarkMode')
  if (savedMode !== null) {
    isDark.value = savedMode === 'true'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Load language preference
  currentLanguage.value = getCurrentLanguage()
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  localStorage.setItem('isDarkMode', isDark.value)
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark-mode')
  } else {
    html.classList.remove('dark-mode')
  }
}
</script>

<style lang="scss" scoped>
.settings-container {
  max-width: 1000px;
  margin: 0 auto;

  .settings-header {
    margin-bottom: 3rem;
    animation: slideInUp 0.5s ease-out;

    h1 {
      font-size: 2.5rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-weight: 800;
      letter-spacing: -1px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .settings-section {
    margin-bottom: 2.5rem;
    padding: 2rem;
    background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.6));
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--border-color);
    border-radius: 14px;
    box-shadow: var(--shadow-sm);
    animation: slideInUp 0.5s ease-out;
    position: relative;

    html.dark-mode & {
      background: rgba(30, 41, 59, calc(var(--glass-opacity) * 1.2));
    }

    &.disabled-section {
      opacity: 0.7;
      background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.4));

      html.dark-mode & {
        background: rgba(30, 41, 59, calc(var(--glass-opacity) * 0.6));
      }
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);

      .section-icon {
        font-size: 1.5rem;
        color: var(--primary);
      }

      h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--text-primary);
        flex: 1;
      }

      .coming-soon-badge {
        display: inline-block;
        padding: 0.375rem 0.875rem;
        background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
        color: white;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
      }
    }

    .settings-content {
      .setting-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
      }

      .language-info {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(16, 185, 129, 0.1);
        border-left: 3px solid var(--primary);
        border-radius: 6px;
        font-size: 0.9rem;
        color: var(--text-primary);
        margin-bottom: 0;
      }
    }
  }

  // Disabled Overlay
  .disabled-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(2px);
    border-radius: 14px;
    pointer-events: none;
    z-index: 10;

    html.dark-mode & {
      background: rgba(15, 23, 42, 0.9);
    }

    .coming-soon-message {
      text-align: center;
      color: var(--text-primary);
      pointer-events: none;

      .rocket-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        animation: float 3s ease-in-out infinite;
      }

      p {
        margin: 0.5rem 0;
        font-weight: 600;
        font-size: 1.1rem;

        &:first-of-type {
          color: var(--primary);
        }

        &.message-subtext {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 400;
        }
      }
    }
  }

  // Language Settings
  .language-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;

    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    .language-btn {
      padding: 1rem;
      border: 2px solid var(--border-color);
      border-radius: 10px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      .lang-flag {
        font-size: 2rem;
      }

      .lang-name {
        font-size: 0.9rem;
        font-weight: 500;
      }

      &:hover:not(:disabled) {
        border-color: var(--primary);
        background: rgba(16, 185, 129, 0.1);
        transform: translateY(-2px);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      &.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
    }
  }

  // Theme Settings
  .theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;

    .theme-btn {
      padding: 1.5rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 10px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      .theme-icon {
        font-size: 2rem;
        color: var(--primary);
      }

      &:hover {
        border-color: var(--primary);
        background: rgba(16, 185, 129, 0.1);
        transform: translateY(-2px);
      }

      &.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

        .theme-icon {
          color: white;
        }
      }
    }
  }

  // About Section
  .about-info {
    padding: 1rem;

    p {
      margin: 0.5rem 0;
      color: var(--text-primary);

      &:first-child {
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }

      &:nth-child(2) {
        color: var(--text-secondary);
        font-size: 0.95rem;
      }

      &.about-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: 1rem;
      }
    }
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .settings-container {
    .settings-section {
      padding: 1.5rem;
    }

    .language-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>