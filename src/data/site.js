// Edit this file to change your public profile and project list.
export const profile = {
  name: 'Jason Reid',
  tagline: 'Computer Science graduate building clean, practical software and learning networking along the way.',
  about:
    'I recently earned a B.S. in Computer Science from the University of Central Missouri. I enjoy building web apps, working with data structures and algorithms, and writing maintainable code. I am also studying for the Cisco CCNA to deepen my networking skills.',
  email: 'jasonreidjr1@gmail.com',
  github: 'https://github.com/reid-json',
  linkedin: 'https://www.linkedin.com/in/jason-reid-1554693a7',
}

export const skills = [
  'Python', 'Java', 'JavaScript', 'Vue.js', 'SQL', 'Git',
  'Object-Oriented Programming', 'Data Structures & Algorithms',
  'Software Development Lifecycle', 'Networking (CCNA in progress)',
]

// To add a web app: drop its files in public/apps/<name>/ (with an index.html)
// and add an entry here with link: '/apps/<name>/index.html'.
export const projects = [
  {
    title: 'PacketPath — CCNA Study Site',
    description: 'Interactive CCNA 200-301 study space with a learning path, flashcards, practice questions, and saved progress.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: '/apps/ccna/index.html',
    repo: 'https://github.com/reid-json/CCNA',
  },
  {
    title: 'ClusterCraft — CKA Study Site',
    description: 'Offline-first Kubernetes lessons with prediction-first learning, a bounded practice simulator, graded labs, Smart Notes, evidence-based career practice, local game progression, and timed mock tasks.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Kubernetes'],
    link: '/apps/cka/index.html',
    repo: 'https://github.com/reid-json/CKA',
  },
]
