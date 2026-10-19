# PacketPath — CCNA Study Site

A small, dependency-free study site for the Cisco CCNA 200-301. Progress and settings are saved in the browser.

- **Overview** (`index.html`): learning path, flashcards, quick quiz, stats
- **Study** (`study.html`): pick an exam domain; spoiler-free reasoning prompts on the left, question on the right. Answer to unlock the full lesson and explanation, whether right or wrong. Use "Find next unanswered" to progress or "Review missed questions" to revisit explanations.
- **Practice exam** (`exam.html`): a full 100-question CCNA-style exam (multiple choice, drag-and-drop matching, and hands-on CLI labs) with a 120-minute countdown, plus 50- and 20-question versions. A switch shows right/wrong after each question or hides it until the end. Includes flagging, a question navigator, results by domain, and a review.
- Dark mode on every page (toggle in the header, remembered)

## Notebook and learning journey

- The field notebook on the study page autosaves as you type, per topic and domain. Move between questions in a topic without losing your notes. Add the current question and reflection prompts with one click.
- Browse/search saved notes to return to a topic. Export all notes as a Markdown file for backup. Notes are plain text, not rendered HTML.
- The overview and study page show XP, levels, milestone badges, a daily quest of 10 new study questions, and a calendar-day streak. Topic badges on the study page track completion and 80%+ first-try accuracy.
- A new study question earns 15 XP when correct or 5 XP when missed. Each question earns once; resetting a domain preserves notes and rewards and cannot farm XP. Rewards start with attempts made after this feature was added; earlier answers remain intact. Quick quizzes and exams do not earn XP.
- Notes and rewards use the separate browser storage key `packetpath-learning-v1`. They are not uploaded or synced between devices. Clearing site data removes them; export your notebook regularly. Storage failures show a visible warning, and unsaved notes remain exportable while the page is open.
- Guided prompts are chosen by domain and question wording in `reasoningPrompts` in `quiz.js`; they do not read the answer, explanation, lesson facts, or code before submission.

## Run it

Open `index.html` in a browser. No build step.

## Edit it

- Two separate pools (no overlap), merged by `bank.js`:
  - Study pool (~1000 questions with lessons): `data.js` (starter set) plus `study-*.js` (one `studyTopics.push({...})` per file)
  - Exam pool (~450 questions): `exam-bank.js` (hand-built, incl. drag-and-drop and CLI labs) plus `exam-*.js` (`examPool.push({...})`); labs use the simulator in `qtypes.js`
- Validate new content files with a quick check that each question has 4-5 options and a valid answer index.
- Flashcards: `script.js`
- Look and feel: `theme.css` (colors, dark mode), `pages.css` (study/exam pages), `styles.css` (home page)
- Notebook/XP storage and journey display: `learning.js`; notebook and journey styles: `learning.css`; study interactions: `study.js`

## Validate changes

In the standalone CCNA repository, run `node --test tests/learning.test.js` for notebook persistence/export, XP deduplication, daily quests, streaks, storage errors, and spoiler-free lesson tests across all 1000 study questions. No dependencies are needed.

## Where it's hosted

A copy lives in the portfolio repo at `public/apps/ccna/` and is served at <https://reid-json.net/apps/ccna/index.html>.
After changing files here, copy all `*.html`, `*.css` and `*.js` files into that folder in the [Portfolio](https://github.com/reid-json/Portfolio) repo and push.
