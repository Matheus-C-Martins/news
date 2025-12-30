<template>
  <div class="route-loader">
    <div class="loader-container">
      <div class="spinner"></div>
      <p class="loader-text">Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RouteLoader'
}
</script>

<style scoped>
.route-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  width: 100%;
}

.loader-container {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid rgba(99, 102, 241, 0.1);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loader-text {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Dark mode support */
:root.dark-mode .loader-text {
  color: #9ca3af;
}

:root.dark-mode .spinner {
  border-color: rgba(139, 92, 246, 0.1);
  border-top-color: #8b5cf6;
}
</style>
