<script setup>
import { profile, skills, projects } from '../data/site.js'
</script>

<template>
  <main class="container">
    <section class="hero">
      <p class="eyebrow">Hi, I'm</p>
      <h1 class="name">{{ profile.name }}</h1>
      <p class="tagline">{{ profile.tagline }}</p>
      <div class="actions">
        <a href="#projects" class="btn primary">View projects</a>
        <a href="#contact" class="btn">Get in touch</a>
      </div>
    </section>

    <section id="about">
      <h2>About</h2>
      <p class="lead">{{ profile.about }}</p>
    </section>

    <section id="stack">
      <h2>Skills</h2>
      <ul class="chips">
        <li v-for="skill in skills" :key="skill">{{ skill }}</li>
      </ul>
    </section>

    <section id="projects">
      <h2>Projects &amp; Apps</h2>
      <div class="grid">
        <article v-for="project in projects" :key="project.title" class="card">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <ul class="tags">
            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
          </ul>
          <div class="card-links">
            <a :href="project.link" class="link">Open app ↗</a>
            <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener" class="link">GitHub ↗</a>
          </div>
        </article>
      </div>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <p class="lead">Open to opportunities and conversations. The best way to reach me:</p>
      <div class="actions">
        <a :href="`mailto:${profile.email}`" class="btn primary">{{ profile.email }}</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener" class="btn">LinkedIn ↗</a>
        <a :href="profile.github" target="_blank" rel="noopener" class="btn">GitHub ↗</a>
      </div>
    </section>

    <footer class="footer">© {{ new Date().getFullYear() }} {{ profile.name }}</footer>
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0 3rem;
}

section {
  margin-bottom: 5rem;
  scroll-margin-top: 6rem;
}

.hero {
  padding: 4rem 0 2rem;
}

.eyebrow {
  color: var(--accent);
  font-weight: 500;
  letter-spacing: 0.08em;
  margin-bottom: 0.25rem;
}

.name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.8rem, 8vw, 5rem);
  font-weight: 600;
  line-height: 1.05;
  color: #f1f5f9;
  margin-bottom: 1.25rem;
}

.tagline,
.lead {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 700px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.btn {
  padding: 0.7rem 1.2rem;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  color: var(--text-main);
  transition: border-color 0.2s, background-color 0.2s;
}

.btn:hover {
  border-color: var(--accent);
}

.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #0b1220;
}

.btn.primary:hover {
  background: #a5e2fd;
}

h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.9rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 1.25rem;
}

.chips,
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.chips li {
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.92rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.75rem;
  border: 1px solid var(--card-border);
  border-radius: 14px;
  background: var(--card-bg);
  transition: transform 0.2s, border-color 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  border-color: rgba(125, 211, 252, 0.4);
}

.card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  color: #f1f5f9;
}

.card p {
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

.tags li {
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: rgba(125, 211, 252, 0.1);
  color: var(--accent);
  font-size: 0.8rem;
}

.card-links {
  display: flex;
  gap: 1.25rem;
  margin-top: auto;
}

.footer {
  padding-top: 2rem;
  border-top: 1px solid var(--card-border);
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  section {
    margin-bottom: 3.5rem;
  }
  .hero {
    padding-top: 2rem;
  }
}
</style>
