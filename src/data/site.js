// Edit this file to change your public profile and project list.
export const profile = {
  name: 'Jason Reid',
  tagline: 'Practical software. Connected systems. Continuous learning.',
  role: 'Computer Science graduate · Software & networking',
  about:
    'I earned a B.S. in Computer Science from the University of Central Missouri. I build practical applications, enjoy solving problems with data structures and algorithms, and value maintainable code. My projects span networking and Kubernetes study tools, a daily reading workspace, audio software, and university projects in cloud computing and software architecture.',
  introduction: 'I’m Jason Reid, a Computer Science graduate building useful apps for learning, creative work, and everyday curiosity.',
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
  {
    title: 'Morning Pages — Daily Reading Room',
    name: 'Morning Pages',
    category: 'Daily reading & personal learning',
    description: 'A cozy daily reading room across seven interests, pairing verified fresh sources with original guides, a global notebook, and gentle learning progress.',
    tags: ['JavaScript', 'Python', 'GitHub Actions'],
    highlights: ['Daily source-backed reading, coding concepts & an edition archive', 'Saved reads, article notes & portable browser backups', 'Quizzes, XP, streaks & spaced review — no account or paid API'],
    link: '/apps/morning-pages/index.html',
  },
  {
    title: 'DAW — Digital Audio Workstation',
    name: 'DAW',
    category: 'Desktop audio software',
    description: 'A digital audio workstation project built with C++ and JUCE. Desktop source is available on GitHub.',
    tags: ['C++', 'JUCE', 'CMake'],
    status: 'Desktop source',
    repo: 'https://github.com/reid-json/DAW',
  },
  {
    title: 'BookStore',
    category: 'Software design & architecture',
    description: 'A Python bookstore project for Software Design & Architecture at the University of Central Missouri.',
    tags: ['Python', 'Software Architecture'],
    status: 'Source project',
    repo: 'https://github.com/reid-json/BookStore',
  },
  {
    title: 'Shelves',
    category: 'Cloud computing',
    description: 'A Vue application and AWS pipelining project for Cloud Computing at the University of Central Missouri.',
    tags: ['Vue.js', 'AWS', 'Cloud Computing'],
    status: 'Source project',
    repo: 'https://github.com/reid-json/Shelves',
  },
  {
    title: 'ClientServer',
    category: 'Operating systems',
    description: 'A Java client/server project for Operating Systems at the University of Central Missouri.',
    tags: ['Java', 'Client/Server'],
    status: 'Source project',
    repo: 'https://github.com/reid-json/ClientServer',
  },
  {
    title: 'Geekcode',
    category: 'Coding practice',
    description: 'A coding-practice application in development. Not yet published as a live app.',
    tags: ['Coding Practice', 'In Development'],
    status: 'In development',
    repo: 'https://github.com/reid-json/Geekcode',
  },
]
