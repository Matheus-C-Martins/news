<template>
  <nav class="navbar" :class="{ 'dark-mode': isDark }">
    <div class="navbar-container">
      <!-- Logo (clickable) -->
      <router-link to="/" class="navbar-logo" @click="isMobileMenuOpen = false">
        <img :src="logoURL" alt="News logo" />
        <span class="logo-text">NewsHub</span>
      </router-link>

      <!-- Desktop Menu -->
      <div class="navbar-menu" :class="{ active: isMobileMenuOpen }">
        <div class="nav-links">
          <router-link to="/shows" class="nav-link" @click="isMobileMenuOpen = false">
            <fa icon="fa-solid fa-film" />
            <span>Entertainment</span>
          </router-link>
          <router-link to="/sports" class="nav-link" @click="isMobileMenuOpen = false">
            <fa icon="fa-solid fa-medal" />
            <span>Sports</span>
          </router-link>
          <router-link to="/weather" class="nav-link" @click="isMobileMenuOpen = false">
            <fa icon="fa-solid fa-sun" />
            <span>Weather</span>
          </router-link>
          <router-link to="/technology" class="nav-link" @click="isMobileMenuOpen = false">
            <fa icon="fa-solid fa-microchip" />
            <span>Technology</span>
          </router-link>
          <router-link to="/finance" class="nav-link" @click="isMobileMenuOpen = false">
            <fa icon="fa-solid fa-chart-line" />
            <span>Finance</span>
          </router-link>
        </div>
      </div>

      <!-- Right Controls -->
      <div class="navbar-controls">
        <!-- Dark Mode Toggle -->
        <button class="control-btn dark-mode-btn" @click="toggleDarkMode" :title="isDark ? 'Light mode' : 'Dark mode'">
          <fa v-if="isDark" icon="fa-solid fa-sun" />
          <fa v-else icon="fa-solid fa-moon" />
        </button>

        <!-- Settings -->
        <router-link to="/settings" class="control-btn settings-btn" title="Settings" @click="isMobileMenuOpen = false">
          <fa icon="fa-solid fa-gear" />
        </router-link>

        <!-- Mobile Menu Toggle -->
        <button class="hamburger" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue'
import logoURL from '../assets/logo.png'

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-dark-mode'])

const isMobileMenuOpen = ref(false)

const isDark = computed(() => props.isDark)

const toggleDarkMode = () => {
  emit('toggle-dark-mode')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<style lang="scss" scoped>
.navbar {
  background: linear-gradient(135deg, var(--dark) 0%, var(--dark-alt) 100%);
  color: var(--light);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.dark-mode {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  max-width: 100%;
  margin: 0 auto;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, var(--primary) 0%, #22c55e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: none;

    @media (min-width: 768px) {
      display: inline;
    }
  }
}

.navbar-menu {
  display: flex;
  flex: 1;
  margin: 0 2rem;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: linear-gradient(135deg, var(--dark) 0%, var(--dark-alt) 100%);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    gap: 0;

    .navbar-menu.active & {
      max-height: 500px;
    }
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: var(--light);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  position: relative;

  fa {
    font-size: 1.1rem;
  }

  span {
    @media (max-width: 640px) {
      display: none;
    }
  }

  &:hover {
    background: rgba(74, 222, 128, 0.1);
    color: var(--primary);

    fa {
      transform: translateY(-2px);
    }
  }

  &.router-link-active {
    background: rgba(74, 222, 128, 0.2);
    color: var(--primary);
    border-bottom: 2px solid var(--primary);

    fa {
      color: var(--primary);
    }
  }

  &.router-link-exact-active {
    background: rgba(74, 222, 128, 0.2);
    color: var(--primary);
    border-bottom: 2px solid var(--primary);

    fa {
      color: var(--primary);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0;
    padding: 0.75rem 1.5rem;

    span {
      display: inline;
    }

    &.router-link-active,
    &.router-link-exact-active {
      background: rgba(74, 222, 128, 0.15);
      border-bottom: 3px solid var(--primary);
      border-radius: 0;
    }
  }
}

.navbar-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--light);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  text-decoration: none;

  &:hover {
    background: rgba(74, 222, 128, 0.2);
    color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1rem;
  }
}

.dark-mode-btn {
  &:hover fa {
    animation: rotate 0.3s ease-out;
  }
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    width: 100%;
    height: 2px;
    background: var(--light);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &:hover span {
    background: var(--primary);
  }

  &.active {
    span:nth-child(1) {
      transform: rotate(45deg) translate(8px, 8px);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.75rem 1rem;
  }

  .navbar-menu {
    margin: 0;
  }

  .navbar-logo .logo-text {
    display: none;
  }
}
</style>