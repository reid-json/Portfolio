# PacketPath — CCNA Study Site

A small, dependency-free study site for the Cisco CCNA 200-301. Progress and settings are saved in the browser.

- **Overview** (`index.html`): learning path, flashcards, quick quiz, stats
- **Study** (`study.html`): pick an exam domain; quick lesson on the left, question on the right, explanation whether you're right or wrong
- **Practice exam** (`exam.html`): a full 100-question CCNA-style exam (multiple choice, drag-and-drop matching, and hands-on CLI labs) with a 120-minute countdown, plus 50- and 20-question versions. A switch shows right/wrong after each question or hides it until the end. Includes flagging, a question navigator, results by domain, and a review.
- Dark mode on every page (toggle in the header, remembered)

## Run it

Open `index.html` in a browser. No build step.

## Edit it

- Two separate pools (no overlap), merged by `bank.js`:
  - Study pool (~1000 questions with lessons): `data.js` (starter set) plus `study-*.js` (one `studyTopics.push({...})` per file)
  - Exam pool (~450 questions): `exam-bank.js` (hand-built, incl. drag-and-drop and CLI labs) plus `exam-*.js` (`examPool.push({...})`); labs use the simulator in `qtypes.js`
- Validate new content files with a quick check that each question has 4-5 options and a valid answer index.
- Flashcards: `script.js`
- Look and feel: `theme.css` (colors, dark mode), `pages.css` (study/exam pages), `styles.css` (home page)

## Where it's hosted

A copy lives in the portfolio repo at `public/apps/ccna/` and is served at <https://reid-json.net/apps/ccna/index.html>.
After changing files here, copy all `*.html`, `*.css` and `*.js` files into that folder in the [Portfolio](https://github.com/reid-json/Portfolio) repo and push.
