<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="logo">
      <img :src="logoURL" alt="News website logo" /> 
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu" title="Toggle sidebar">
        <fa class="material-icons" icon="fa-solid fa-angles-right" />
      </button>
    </div>

    <h3>Menu</h3>
    <div class="menu">
      <router-link to="/" class="button" title="All News">
        <fa class="material-icons" icon="fa-solid fa-earth-europe" />
        <span class="text">All</span>
      </router-link>
      <router-link to="/shows" class="button" title="Entertainment News">
        <fa class="material-icons" icon="fa-solid fa-film" />
        <span class="text">Shows</span>
      </router-link>
      <router-link to="/sports" class="button" title="Sports News">
        <fa class="material-icons" icon="fa-solid fa-medal" />
        <span class="text">Sports</span>
      </router-link>
      <router-link to="/weather" class="button" title="Science & Weather News">
        <fa class="material-icons" icon="fa-solid fa-sun" />
        <span class="text">Weather</span>
      </router-link>
      <router-link to="/technology" class="button" title="Technology News">
        <fa class="material-icons" icon="fa-solid fa-microchip" />
        <span class="text">Technology</span>
      </router-link>
      <router-link to="/finance" class="button" title="Finance & Business News">
        <fa class="material-icons" icon="fa-solid fa-chart-line" />
        <span class="text">Finance</span>
      </router-link>
    </div>

    <div class="flex"></div>
    
    <div class="menu">
      <button class="button dark-mode-toggle" @click="toggleDarkMode" :title="isDark ? 'Light mode' : 'Dark mode'">
        <fa v-if="isDark" class="material-icons" icon="fa-solid fa-sun" />
        <fa v-else class="material-icons" icon="fa-solid fa-moon" />
        <span class="text">{{ isDark ? 'Light' : 'Dark' }}</span>
      </button>
      <router-link to="/settings" class="button" title="Settings">
        <fa class="material-icons" icon="fa-solid fa-gear" />
        <span class="text">Settings</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineEmits, defineProps, computed } from 'vue'
import logoURL from '../assets/logo.png'

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-dark-mode'])

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const isDark = computed(() => props.isDark)

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  localStorage.setItem("is_expanded", is_expanded.value)
}

const toggleDarkMode = () => {
  emit('toggle-dark-mode')
}
</script>

<style lang="scss" scoped>
  aside {
    display: flex;
    flex-direction: column;
    background-color: var(--dark);
    color: var(--light);
    width: calc(2rem + 32px);
    overflow: hidden;
    min-height: 100vh;
    padding: 1rem;
    transition: 0.2s ease-in-out;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;

    .flex {
      flex: 1 1 0%;
    }

    .logo {
      margin-bottom: 1rem;
      img {
        width: 2rem;
      }
    }

    .menu-toggle-wrap {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
      position: relative;
      top: 0;
      transition: 0.2s ease-in-out;

      .menu-toggle {
        transition: 0.2s ease-in-out;
        .material-icons {
          font-size: 2rem;
          color: var(--light);
          transition: 0.2s ease-out;
        }
        &:hover {
          .material-icons {
            color: var(--primary);
            transform: translateX(0.5rem);
          }
        }
      }
    }
    
    h3, .button .text {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }

    h3 {
      color: var(--grey);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    .menu {
      margin: 0 -1rem;

      .button {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: 0.2s ease-in-out;
        padding: 0.5rem 1rem;
        color: var(--light);
        border: none;
        background: none;
        cursor: pointer;
        width: 100%;
        justify-content: flex-start;

        .material-icons {
          font-size: 2rem;
          color: var(--light);
          transition: 0.2s ease-in-out;
          flex-shrink: 0;
        }

        .text {
          color: var(--light);
          transition: 0.2s ease-in-out;
        }

        &:hover {
          background-color: var(--dark-alt);
          .material-icons, .text {
            color: var(--primary);
          }
        }

        &.router-link-exact-active {
          background-color: var(--dark-alt);
          border-right: 5px solid var(--primary);
          .material-icons, .text {
            color: var(--primary);
          }
        }
      }

      .dark-mode-toggle {
        &:hover {
          background-color: var(--dark-alt);
          .material-icons {
            color: var(--primary);
            animation: rotate 0.3s ease-out;
          }
        }
      }
    }

    &.is-expanded {
      width: var(--sidebar-width);
      background: linear-gradient(180deg, var(--dark) 0%, var(--dark-alt) 100%);

      .menu-toggle-wrap {
        top: -3rem;
        .menu-toggle {
          transform: rotate(-180deg);
        }
      }

      h3, .button .text {
        opacity: 1;
      }

      .button {
        .material-icons {
          margin-right: 1rem;
        }
      }
    }

    @media (max-width: 1024px) {
      position: fixed;
      z-index: 99;
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
</style>