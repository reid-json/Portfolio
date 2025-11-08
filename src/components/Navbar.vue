<script setup lang="ts">
const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Tech Stack', href: '#stack' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]
</script>

<template>
  <nav class="navbar">
    <div class="logo">Jason Reid</div>
    <ul class="nav-links">
      <li v-for="item in navItems" :key="item.name">
        <a :href="item.href">{{ item.name }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
:root {
  --accent: #7dd3fc;
  --text-main: #d0d0d0;
  --bg-dark: #121212;
  --hover-bg: rgba(125, 211, 252, 0.1);
}

.navbar {
  width: 100%;
  padding: 1.5rem 5vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-dark);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(125, 211, 252, 0.1);
  backdrop-filter: blur(6px);
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-main);
  text-decoration: none;
  padding: 4px 6px;
  transition: background-color 0.2s ease;
}

.nav-links a:hover {
  background-color: var(--hover-bg);
  border-radius: 4px;
}
</style>