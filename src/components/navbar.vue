<template>
  <nav class="navbar" :class="{ 'navbar--mobile-open': isMobileMenuOpen }">
    <div class="navbar__container">
      <!-- Logo -->
      <router-link to="/news" class="navbar__logo">
        <fa icon="fa-solid fa-newspaper" />
        <span>NewsHub</span>
      </router-link>

      <!-- Desktop Navigation Menu -->
      <ul class="navbar__menu navbar__menu--desktop">
        <li>
          <router-link to="/news/entertainment" class="navbar__link" @click="closeMobileMenu">
            <fa icon="fa-solid fa-tv" />
            <span>Entertainment</span>
          </router-link>
        </li>
        <li>
          <router-link to="/news/sports" class="navbar__link" @click="closeMobileMenu">
            <fa icon="fa-solid fa-football" />
            <span>Sports</span>
          </router-link>
        </li>
        <li>
          <router-link to="/news/science" class="navbar__link" @click="closeMobileMenu">
            <fa icon="fa-solid fa-flask" />
            <span>Science</span>
          </router-link>
        </li>
        <li>
          <router-link to="/news/technology" class="navbar__link" @click="closeMobileMenu">
            <fa icon="fa-solid fa-microchip" />
            <span>Technology</span>
          </router-link>
        </li>
        <li>
          <router-link to="/news/business" class="navbar__link" @click="closeMobileMenu">
            <fa icon="fa-solid fa-briefcase" />
            <span>Business</span>
          </router-link>
        </li>
      </ul>

      <!-- Right Side Controls -->
      <div class="navbar__controls">
        <!-- Settings Link -->
        <router-link to="/news/settings" class="navbar__btn navbar__btn--icon" @click="closeMobileMenu">
          <fa icon="fa-solid fa-gear" class="navbar__icon" />
        </router-link>

        <!-- Mobile Hamburger Menu -->
        <button
          @click="toggleMobileMenu"
          class="navbar__btn navbar__btn--hamburger"
          :class="{ 'navbar__btn--hamburger-open': isMobileMenuOpen }"
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <ul class="navbar__menu navbar__menu--mobile" v-if="isMobileMenuOpen">
      <li>
        <router-link to="/news/" class="navbar__link" @click="closeMobileMenu">
          <fa icon="fa-solid fa-home" />
          <span>All News</span>
        </router-link>
      </li>
      <li>
        <router-link to="/news/entertainment" class="navbar__link" @click="closeMobileMenu">
          <fa icon="fa-solid fa-tv" />
          <span>Entertainment</span>
        </router-link>
      </li>
      <li>
        <router-link to="/news/sports" class="navbar__link" @click="closeMobileMenu">
          <fa icon="fa-solid fa-football" />
          <span>Sports</span>
        </router-link>
      </li>
      <li>
        <router-link to="/news/science" class="navbar__link" @click="closeMobileMenu">
          <fa icon="fa-solid fa-flask" />
          <span>Science</span>
        </router-link>
      </li>
      <li>
        <router-link to="/news/technology" class="navbar__link" @click="closeMobileMenu">
          <fa icon="fa-solid fa-microchip" />
          <span>Technology</span>
        </router-link>
      </li>
      <li>
        <router-link to="/news/business" class="navbar__link" @click="closeMobileMenu">
          <fa icon="fa-solid fa-briefcase" />
          <span>Business</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style lang="scss" scoped>
.navbar {
  background: linear-gradient(
    90deg,
    rgba(var(--navbar-bg-start), 0.95) 0%,
    rgba(var(--navbar-bg-end), 0.95) 100%
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  color: var(--navbar-text);

  html.dark-mode & {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
}

:root {
  --navbar-bg-start: 31, 41, 55;
  --navbar-bg-end: 51, 65, 85;
  --navbar-text: white;
  --navbar-text-secondary: rgba(255, 255, 255, 0.8);
}

html.dark-mode {
  --navbar-bg-start: 15, 23, 42;
  --navbar-bg-end: 30, 41, 59;
  --navbar-text: white;
  --navbar-text-secondary: rgba(255, 255, 255, 0.8);
}

/* Light mode specific overrides */
@media (prefers-color-scheme: light) {
  html:not(.dark-mode) {
    --navbar-bg-start: 59, 130, 246;
    --navbar-bg-end: 37, 99, 235;
    --navbar-text: white;
    --navbar-text-secondary: rgba(255, 255, 255, 0.9);
  }
}

[data-color-scheme="light"] {
  --navbar-bg-start: 59, 130, 246;
  --navbar-bg-end: 37, 99, 235;
  --navbar-text: white;
  --navbar-text-secondary: rgba(255, 255, 255, 0.9);
}

.navbar__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--navbar-text);
  font-weight: 700;
  font-size: 1.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: var(--primary);
    transform: scale(1.05);
  }

  fa {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    gap: 0.5rem;

    fa {
      font-size: 1.5rem;
    }
  }
}

.navbar__menu {
  list-style: none;
  display: flex;
  gap: 0;
  margin: 0;
  padding: 0;
  align-items: center;

  &--desktop {
    display: none;

    @media (min-width: 768px) {
      display: flex;
      flex: 1;
      margin: 0 2rem;
      gap: 0.25rem;
    }
  }

  &--mobile {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: rgba(var(--navbar-bg-end), 0.98);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideDown 0.3s ease-out;

    @media (min-width: 768px) {
      display: none;
    }
  }
}

.navbar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--navbar-text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;

  &:hover {
    color: var(--navbar-text);
    background: rgba(255, 255, 255, 0.15);
    padding-left: 1.2rem;
  }

  &.router-link-active {
    color: var(--primary);
    background: rgba(16, 185, 129, 0.2);
    border-bottom: 2px solid var(--primary);
  }

  fa {
    font-size: 1.1rem;
    transition: transform 0.2s ease;
  }

  &:hover fa {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;

    span {
      display: flex;
    }
  }
}

.navbar__controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.navbar__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: var(--navbar-text);
  border: 2px solid transparent;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: var(--primary);
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &--icon fa {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }

  &--hamburger {
    display: flex;
    flex-direction: column;
    width: auto;
    height: auto;
    padding: 0.5rem;
    background: transparent;
    border: none;

    @media (min-width: 768px) {
      display: none;
    }

    span {
      width: 24px;
      height: 2px;
      background: var(--navbar-text);
      margin: 4px 0;
      border-radius: 2px;
      transition: all 0.3s ease;
      display: block;
    }

    &.navbar__btn--hamburger-open {
      span {
        &:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }

        &:nth-child(2) {
          opacity: 0;
        }

        &:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>