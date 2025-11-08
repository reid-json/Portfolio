<script setup lang="ts">
import HomePage from './HomePage.vue'
</script>

<template>
  <div class="app">
    <HomePage />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&display=swap');

:root {
  --text-main: #d0d0d0;
  --bg-dark: #121212;
}

.app {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  color: var(--text-main);
  background-color: var(--bg-dark);
  display: flex;
  flex-direction: column;
}
</style>