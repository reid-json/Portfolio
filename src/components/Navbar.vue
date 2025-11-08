<script setup lang="ts">
import { ref } from 'vue'

const navItems = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Tech Stack', href: '#stack' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

const isOpen = ref(false)
const toggleMenu = () => (isOpen.value = !isOpen.value)
</script>

<template>
  <nav class="navbar">
    <div class="logo">Jason Reid</div>

    <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle navigation">
      <span :class="{ open: isOpen }"></span>
    </button>

    <ul class="nav-links" :class="{ open: isOpen }">
      <li v-for="item in navItems" :key="item.name">
        <a :href="item.href" @click="isOpen = false">{{ item.name }}</a>
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

/* Desktop nav */
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

/* Hamburger button */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 24px;
  position: relative;
}

.menu-toggle span,
.menu-toggle span::before,
.menu-toggle span::after {
  content: '';
  display: block;
  background: var(--text-main);
  height: 2px;
  width: 100%;
  position: absolute;
  transition: 0.3s ease;
}

.menu-toggle span::before {
  top: -8px;
  position: absolute;
}

.menu-toggle span::after {
  top: 8px;
  position: absolute;
}

.menu-toggle span.open {
  background: transparent;
}

.menu-toggle span.open::before {
  transform: rotate(45deg);
  top: 0;
}

.menu-toggle span.open::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Mobile styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--bg-dark);
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 1rem 5vw;
    gap: 1rem;
    display: none;
  }

  .nav-links.open {
    display: flex;
  }
}
</style>