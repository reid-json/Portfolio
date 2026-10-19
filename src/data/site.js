// Edit this file to change your public profile and project list.
export const profile = {
  name: 'Jason Reid',
  tagline: 'Practical software. Connected systems. Continuous learning.',
  role: 'Computer Science graduate · Software & networking',
  about:
    'I earned a B.S. in Computer Science from the University of Central Missouri. I build practical web applications, enjoy solving problems with data structures and algorithms, and value maintainable code. My current projects bring software development and technical learning together, including CCNA-aligned networking practice and Kubernetes study tools.',
  introduction: 'I’m Jason Reid, a Computer Science graduate building useful web apps and expanding my understanding of networking and infrastructure.',
  education: 'B.S. Computer Science',
  university: 'University of Central Missouri',
  focus: 'Software development, networking & infrastructure',
  studyStatus: 'CCNA studies in progress — not yet certified',
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
    name: 'PacketPath',
    category: 'Networking learning platform',
    description: 'A CCNA-aligned study workspace that combines question-specific guided learning, topic notes, and realistic practice formats with evidence-based progress.',
    highlights: ['1,000 study questions + a separate 452-question exam pool', 'Timed 100-question exams, matching questions & simulated CLI labs', '42-source documentation library, study quests & skills evidence'],
    featured: true,
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: '/apps/ccna/index.html',
    repo: 'https://github.com/reid-json/CCNA',
  },
  {
    title: 'ClusterCraft — CKA Study Site',
    name: 'ClusterCraft',
    category: 'Kubernetes learning platform',
    description: 'Offline-first Kubernetes lessons with prediction-first learning, a bounded practice simulator, graded labs, Smart Notes, evidence-based career practice, local game progression, and timed mock tasks.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Kubernetes'],
    highlights: ['Prediction-first lessons & graded practice labs', 'Bounded Kubernetes simulator & timed mock tasks', 'Smart Notes, local progression & career practice'],
    link: '/apps/cka/index.html',
    repo: 'https://github.com/reid-json/CKA',
  },
]
