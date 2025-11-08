<script setup lang="ts">
interface Project {
  title: string
  description: string
  link: string
}

const projects: Project[] = [
  { title: 'Neural Nexus', description: 'AI-driven data pipeline for real-time analytics.', link: '#' },
  { title: 'Quantum Pulse', description: 'Quantum-inspired algorithm for parallel computation.', link: '#' },
  { title: 'Code Reactor', description: 'Modular codebase for scalable microservices.', link: '#' },
  { title: 'Data Forge', description: 'ETL framework for structured and unstructured data.', link: '#' },
]

const techStack = [
  'TypeScript', 'Vue.js', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL', 'Tailwind', 'Vite'
]
</script>

<template>
  <main class="container">
    <!-- Hero -->
    <section class="hero">
      <h1 class="name">Jason Reid</h1>
      <p class="tagline">Full-stack engineer crafting modular systems, scalable APIs, and clean UIs for the future.</p>
      <a href="#contact" class="cta">Let’s Build Something ↗</a>
    </section>

    <!-- About -->
    <section class="about">
      <h2>About</h2>
      <p>
        I specialize in building future-proof web architectures, rapid prototyping, and clean design systems.
        My work blends backend precision with frontend clarity — always modular, always intentional.
      </p>
    </section>

    <!-- Tech Stack -->
    <section class="stack">
      <h2>Tech Stack</h2>
      <ul class="stack-grid">
        <li v-for="tech in techStack" :key="tech">{{ tech }}</li>
      </ul>
    </section>

    <!-- Projects -->
    <section class="projects">
      <h2>Projects</h2>
      <div class="grid">
        <div v-for="(project, index) in projects" :key="index" class="card">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <a :href="project.link" target="_blank" rel="noopener" class="link">GitHub ↗</a>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="contact" id="contact">
      <h2>Contact</h2>
      <p>Reach out via <a href="mailto:you@example.com">email</a> or connect on <a href="#">LinkedIn</a>.</p>
    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&display=swap');

:root {
  --text-main: #d0d0d0;
  --text-muted: #8a8a8a;
  --accent: #7dd3fc;
  --bg-dark: radial-gradient(ellipse at top, #0b0c10 0%, #0a0a0f 100%);
  --card-bg: rgba(20, 25, 40, 0.6);
  --card-border: rgba(100, 120, 160, 0.2);
  --highlight: #00bfff;
  --glow: 0 0 8px rgba(125, 211, 252, 0.3);
}

body {
  margin: 0;
  background: var(--bg-dark);
  font-family: 'Inter', sans-serif;
  color: var(--text-main);
  background-attachment: fixed;
  background-size: cover;
}

.container {
  width: 100%;
  padding: 4rem 5vw;
  box-sizing: border-box;
}

section {
  margin-bottom: 6rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 0;
}

.name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 4.2rem;
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: 1.2px;
  text-shadow: var(--glow);
}

.tagline {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin: 1rem 0 2rem;
  max-width: 800px;
  line-height: 1.6;
}

.cta {
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
  font-size: 1rem;
  border-bottom: 1px solid transparent;
  transition: border 0.2s ease;
}

.cta:hover {
  border-bottom: 1px solid var(--accent);
}

.about h2,
.stack h2,
.projects h2,
.contact h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e2e8f0;
  text-shadow: var(--glow);
}

.about p,
.contact p {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 900px;
  line-height: 1.6;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.stack-grid li {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  color: var(--text-main);
  font-size: 0.95rem;
  border: 1px solid rgba(125, 211, 252, 0.1);
  box-shadow: inset 0 0 4px rgba(125, 211, 252, 0.05);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 0.5rem;
  text-shadow: var(--glow);
}

.card p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
}

.link:hover {
  text-decoration: underline;
}
</style>