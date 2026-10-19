<script setup>
import { profile, skills, projects } from '../data/site.js'

const featuredProject = projects.find((project) => project.featured && project.link) || projects.find((project) => project.link)
const liveAppCount = projects.filter((project) => project.link).length
</script>

<template>
  <main id="main-content" class="container" tabindex="-1">
    <section id="home" class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> {{ profile.role }}</p>
        <h1 id="hero-title">{{ profile.tagline }}</h1>
        <p class="hero-intro">{{ profile.introduction }}</p>
        <div class="actions">
          <a href="#projects" class="btn primary">Explore my work <span aria-hidden="true">↗</span></a>
          <a href="#contact" class="btn">Let’s connect <span aria-hidden="true">→</span></a>
        </div>
        <div class="hero-meta">
          <span>{{ profile.education }}</span>
          <span>{{ liveAppCount }} live apps · {{ projects.length }} projects</span>
        </div>
      </div>
      <aside v-if="featuredProject" class="feature-panel" aria-label="Featured project">
        <div class="feature-top"><span class="terminal-label">PROJECT / 01</span><span class="live-label">LIVE APP</span></div>
        <div class="network-visual" aria-hidden="true">
          <svg viewBox="0 0 360 150" fill="none">
            <path d="M60 40 180 75 300 40M60 110 180 75 300 110M180 25V125" stroke="currentColor" stroke-width="1.5" />
            <circle cx="180" cy="75" r="22" fill="#30495b" stroke="currentColor" />
            <path d="m170 75 7 7 14-15" stroke="currentColor" stroke-width="2" />
            <g fill="#243547" stroke="currentColor"><rect x="46" y="26" width="28" height="28" rx="7" /><rect x="286" y="26" width="28" height="28" rx="7" /><rect x="46" y="96" width="28" height="28" rx="7" /><rect x="286" y="96" width="28" height="28" rx="7" /><circle cx="180" cy="25" r="5" /><circle cx="180" cy="125" r="5" /></g>
          </svg>
        </div>
        <p class="feature-category">{{ featuredProject.category }}</p>
        <h2>{{ featuredProject.name || featuredProject.title }}</h2>
        <p class="feature-description">{{ featuredProject.description }}</p>
        <a :href="featuredProject.link" class="feature-link">Open the study workspace <span aria-hidden="true">↗</span></a>
        <div class="feature-bottom"><span>BUILT TO LEARN BY DOING</span><span aria-hidden="true">[ web / network ]</span></div>
      </aside>
    </section>

    <section id="about" class="about-section" aria-labelledby="about-title">
      <div class="section-heading">
        <p class="eyebrow">01 / THE PERSON BEHIND THE PROJECTS</p>
        <h2 id="about-title">A foundation in software.<br>A curiosity for systems.</h2>
      </div>
      <div class="about-copy">
        <p class="lead">{{ profile.about }}</p>
        <dl class="profile-details">
          <div><dt>Education</dt><dd>{{ profile.education }}<span>{{ profile.university }}</span></dd></div>
          <div><dt>Current focus</dt><dd>{{ profile.focus }}<span>{{ profile.studyStatus }}</span></dd></div>
        </dl>
      </div>
    </section>

    <section id="projects" aria-labelledby="projects-title">
      <div class="section-heading heading-row">
        <div><p class="eyebrow">02 / SELECTED WORK</p><h2 id="projects-title">Useful tools, built with purpose.</h2></div>
        <a :href="profile.github" class="text-link" target="_blank" rel="noopener noreferrer">More on GitHub <span aria-hidden="true">↗</span></a>
      </div>
      <div class="project-grid">
        <article v-for="(project, index) in projects" :key="project.title" class="project-card">
          <div class="project-top"><span class="project-number">{{ String(index + 1).padStart(2, '0') }}</span><span class="project-category">{{ project.category || 'Web application' }}</span><span class="project-status">{{ project.link ? 'Live' : project.status || 'Source project' }}</span></div>
          <h3>{{ project.name || project.title }}</h3>
          <p>{{ project.description }}</p>
          <ul v-if="project.highlights?.length" class="project-highlights">
            <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
          <ul class="tags" aria-label="Project technologies"><li v-for="tag in project.tags" :key="tag">{{ tag }}</li></ul>
          <div class="card-links">
            <a v-if="project.link" :href="project.link" class="btn primary" :aria-label="`Open ${project.name || project.title}`">Open app <span aria-hidden="true">↗</span></a>
            <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener noreferrer" class="text-link" :aria-label="`${project.name || project.title} source on GitHub`">View source <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </div>
      <p class="project-note">Independent learning projects. Practice results and simulations are not certification credentials or production experience.</p>
    </section>

    <section id="stack" class="stack-section" aria-labelledby="stack-title">
      <div class="section-heading"><p class="eyebrow">03 / TECHNICAL TOOLKIT</p><h2 id="stack-title">What I work with.</h2><p class="section-description">A Computer Science foundation, practical web development, and an expanding networking skill set.</p></div>
      <ul class="chips" aria-label="Skills and areas of study"><li v-for="skill in skills" :key="skill">{{ skill }}</li></ul>
    </section>

    <section id="contact" class="contact-section" aria-labelledby="contact-title">
      <div><p class="eyebrow">04 / START A CONVERSATION</p><h2 id="contact-title">Good work starts<br>with a connection.</h2><p>Open to opportunities, project conversations, and learning from other people in tech.</p></div>
      <div class="contact-links">
        <a :href="`mailto:${profile.email}`" class="email-link">{{ profile.email }} <span aria-hidden="true">↗</span></a>
        <div class="actions"><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer" class="btn">LinkedIn <span aria-hidden="true">↗</span></a><a :href="profile.github" target="_blank" rel="noopener noreferrer" class="btn">GitHub <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
    <footer class="footer"><span>© {{ new Date().getFullYear() }} {{ profile.name }}</span><span>Software · Networks · Always learning</span><a href="#home">Back to top ↑</a></footer>
  </main>
</template>

<style scoped>
.container { max-width: 1160px; margin: 0 auto; padding: 0 28px; }
section { margin-bottom: 88px; scroll-margin-top: 100px; }
.hero { display: grid; grid-template-columns: 1.2fr 1fr; gap: 64px; align-items: center; padding: 72px 0; margin-bottom: 24px; }
.eyebrow { color: var(--accent); font-size: 11px; font-weight: 600; letter-spacing: 1.6px; text-transform: uppercase; margin-bottom: 18px; }
.hero .eyebrow { display: flex; align-items: center; gap: 9px; font-size: 10px; letter-spacing: 1.1px; }
.status-dot { flex-shrink: 0; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
h1 { font-size: clamp(38px, 4.8vw, 60px); letter-spacing: -2.5px; line-height: 1.08; font-weight: 600; margin-bottom: 24px; }
.hero-intro { font-size: 17px; color: var(--text-muted); max-width: 47ch; }
.actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
.btn { display: inline-flex; justify-content: center; align-items: center; gap: 16px; padding: 11px 18px; border: 1px solid var(--card-border); border-radius: 7px; font-size: 13px; font-weight: 600; color: var(--text-main); background: var(--surface); transition: background .2s, border-color .2s; }
.btn:hover { border-color: var(--accent); background: var(--accent-soft); }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn.primary:hover { background: var(--accent-hover); }
.hero-meta { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 26px; color: var(--text-muted); font-size: 11px; }
.hero-meta span + span { border-left: 1px solid var(--card-border); padding-left: 20px; }
.feature-panel { padding: 26px; background: var(--ink); color: #e2ebf1; border-radius: 15px; border: 1px solid #3a4c5e; box-shadow: 0 18px 35px -20px #24354766; }
.feature-top, .feature-bottom { display: flex; justify-content: space-between; gap: 12px; font: 10px/1.4 ui-monospace, Consolas, monospace; letter-spacing: .6px; color: #b7c8d5; }
.live-label { color: #b4e3d1; }
.network-visual { color: #86bfc8; padding: 10px 0; background-image: radial-gradient(#ffffff14 1px, transparent 1px); background-size: 16px 16px; margin: 20px 0; }
.network-visual svg { display: block; width: 100%; height: 125px; }
.feature-category { font-size: 11px; color: #9ecbd0; margin-bottom: 7px; }
.feature-panel h2 { color: #fff; font-size: 30px; letter-spacing: -.8px; margin-bottom: 14px; }
.feature-description { font-size: 13px; line-height: 1.7; color: #c5d2dd; }
.feature-link { display: flex; justify-content: space-between; color: #b1e2e6; font-size: 13px; font-weight: 600; padding: 12px 0; }
.feature-link:hover { color: #fff; }
.feature-link:focus-visible { outline-color: #b1e2e6; }
.feature-bottom { border-top: 1px solid #455667; padding-top: 18px; margin-top: 12px; font-size: 9px; }
.section-heading h2 { font-size: clamp(26px, 3vw, 34px); letter-spacing: -1px; font-weight: 600; margin-bottom: 24px; }
.about-section { display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; padding-top: 48px; border-top: 1px solid var(--card-border); }
.lead { color: var(--text-muted); font-size: 15px; }
.profile-details { margin: 26px 0 0; display: grid; gap: 16px; }
.profile-details div { display: grid; grid-template-columns: 105px 1fr; gap: 12px; }
.profile-details dt { font-size: 12px; color: var(--text-muted); }
.profile-details dd { margin: 0; font-size: 13px; font-weight: 500; }
.profile-details dd span { display: block; color: var(--text-muted); font-size: 12px; font-weight: 400; margin-top: 3px; }
.heading-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.text-link { font-size: 13px; font-weight: 600; }
.project-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.project-card { background: var(--surface); border: 1px solid var(--card-border); border-radius: 12px; padding: 28px; display: flex; flex-direction: column; transition: border-color .2s, box-shadow .2s; }
.project-card:hover { border-color: #7fa7ae; box-shadow: 0 10px 28px -20px #24354760; }
.project-top { display: flex; align-items: center; gap: 12px; margin-bottom: 26px; }
.project-number { font: 12px ui-monospace, Consolas, monospace; color: var(--accent); background: var(--accent-soft); padding: 6px 8px; border-radius: 4px; }
.project-category { font-size: 11px; color: var(--text-muted); }
.project-status { margin-left: auto; color: var(--accent); font-size: 10px; border: 1px solid #bfd6da; border-radius: 4px; padding: 2px 7px; }
.project-card h3 { font-size: 26px; font-weight: 600; letter-spacing: -.6px; margin-bottom: 14px; }
.project-card p { color: var(--text-muted); font-size: 13px; line-height: 1.8; }
.project-highlights { padding-left: 17px; color: var(--text-main); font-size: 12px; line-height: 1.7; margin: 6px 0 24px; }
.project-highlights li { margin-bottom: 8px; }
.project-highlights li::marker { color: var(--accent); }
.tags, .chips { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; padding: 0; }
.tags { margin: auto 0 22px; }
.tags li { padding: 4px 8px; font: 10px/1.5 ui-monospace, Consolas, monospace; color: var(--text-muted); background: var(--surface-soft); border-radius: 4px; }
.card-links { border-top: 1px solid var(--card-border); padding-top: 20px; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.project-note { color: var(--text-muted); font-size: 11px; margin-top: 16px; }
.stack-section { display: grid; grid-template-columns: 1fr 1.2fr; gap: 64px; border-top: 1px solid var(--card-border); padding-top: 40px; }
.section-description { font-size: 13px; color: var(--text-muted); max-width: 34ch; }
.chips { align-content: start; margin: 0; }
.chips li { padding: 9px 13px; font-size: 12px; border: 1px solid var(--card-border); border-radius: 6px; background: #ffffff80; }
.contact-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; background: #e2eaee; border: 1px solid #cbd9e1; border-radius: 12px; padding: 36px; margin-bottom: 40px; }
.contact-section h2 { font-size: 32px; letter-spacing: -.9px; margin-bottom: 16px; }
.contact-section p:not(.eyebrow) { font-size: 13px; color: var(--text-muted); margin-bottom: 0; max-width: 45ch; }
.email-link { display: inline-block; font-size: clamp(14px, 1.7vw, 18px); font-weight: 600; overflow-wrap: anywhere; }
.contact-links .actions { margin-top: 18px; }
.footer { display: flex; gap: 16px; flex-wrap: wrap; justify-content: space-between; padding: 0 0 28px; color: var(--text-muted); font-size: 11px; }
@media (max-width: 900px) {
  .hero { gap: 30px; padding: 50px 0; }
  .about-section, .stack-section { gap: 30px; }
}
@media (max-width: 700px) {
  .container { padding: 0 20px; }
  section { margin-bottom: 52px; }
  .hero, .about-section, .stack-section, .contact-section { grid-template-columns: 1fr; }
  .hero { padding-top: 40px; gap: 32px; }
  h1 { letter-spacing: -1.8px; }
  .hero-intro { font-size: 15px; }
  .project-grid { grid-template-columns: 1fr; }
  .project-card { padding: 22px; }
  .project-top { gap: 8px; }
  .project-category { font-size: 10px; }
  .contact-section { padding: 24px; gap: 24px; }
  .footer { justify-content: flex-start; }
}
</style>
