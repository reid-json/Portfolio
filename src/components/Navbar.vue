<script setup>
import { ref } from 'vue'
import { profile } from '../data/site.js'

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#stack' },
  { name: 'Contact', href: '#contact' },
]
const isOpen = ref(false)
</script>

<template>
  <header class="site-header" @keydown.esc="isOpen = false">
    <nav class="navbar" aria-label="Main navigation">
      <a class="logo" href="#home" @click="isOpen = false">
        <span class="logo-mark" aria-hidden="true">jr<span>.</span></span>
        <span>{{ profile.name }}</span>
      </a>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isOpen"
        aria-controls="portfolio-nav"
        :aria-label="isOpen ? 'Close navigation' : 'Open navigation'"
        @click="isOpen = !isOpen"
      >{{ isOpen ? 'Close' : 'Menu' }} <span aria-hidden="true">{{ isOpen ? '−' : '+' }}</span></button>
      <ul id="portfolio-nav" class="nav-links" :class="{ open: isOpen }">
        <li v-for="item in navItems" :key="item.name">
          <a :href="item.href" @click="isOpen = false">{{ item.name }}</a>
        </li>
        <li><a class="github-link" :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(245, 247, 249, .96);
  border-bottom: 1px solid var(--card-border);
  backdrop-filter: blur(12px);
}
.navbar {
  max-width: 1160px;
  margin: auto;
  padding: 18px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--text-main);
  font-size: 15px;
}
.logo-mark {
  font: 600 23px/1 'Space Grotesk', sans-serif;
  padding: 10px;
  color: var(--surface);
  background: var(--ink);
  border-radius: 9px;
  letter-spacing: -1px;
}
.logo-mark span { color: #9fd3d5; }
.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-links a { font-size: 14px; font-weight: 500; color: var(--text-muted); }
.nav-links a:hover { color: var(--accent); }
.nav-links .github-link { color: var(--text-main); border-left: 1px solid var(--card-border); padding-left: 24px; }
.menu-toggle { display: none; }
@media (max-width: 700px) {
  .navbar { padding: 14px 20px; flex-wrap: wrap; gap: 12px; }
  .menu-toggle {
    display: inline-flex; gap: 12px; padding: 7px 12px; border: 1px solid var(--card-border);
    border-radius: 6px; background: var(--surface); color: var(--text-main); cursor: pointer;
  }
  .nav-links { display: none; flex-basis: 100%; flex-wrap: wrap; gap: 12px 22px; padding: 14px 0 4px; }
  .nav-links.open { display: flex; }
  .nav-links .github-link { border: 0; padding: 0; }
}
</style>
