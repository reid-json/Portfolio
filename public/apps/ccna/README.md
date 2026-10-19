# PacketPath — CCNA Study Site

A small, dependency-free study site for the Cisco CCNA 200-301. Progress and settings are saved in the browser.

- **Overview** (`index.html`): learning path, flashcards, quick quiz, stats
- **Study** (`study.html`): pick an exam domain; spoiler-free reasoning prompts on the left, question on the right. Answer to unlock the full lesson and explanation, whether right or wrong. Use "Find next unanswered" to progress or "Review missed questions" to revisit explanations.
- **Practice exam** (`exam.html`): a full 100-question CCNA-style exam (multiple choice, drag-and-drop matching, and hands-on CLI labs) with a 120-minute countdown, plus 50- and 20-question versions. A switch shows right/wrong after each question or hides it until the end. Includes flagging, a question navigator, results by domain, and a review.
- **Library** (`library.html`): searchable, domain-filtered primary references from Cisco, IETF/RFC Editor, IANA, NIST, and official automation-tool documentation.
- **Skills & career** (`skills.html`): assessment-backed knowledge coverage, gaps, conservative resume wording, and personalized interview prompts with references.
- Dark mode on every page (toggle in the header, remembered)

## Notebook and learning journey

- The field notebook on the study page autosaves as you type, per topic and domain. Move between questions in a topic without losing your notes. Add the current question and reflection prompts with one click.
- Browse/search saved notes to return to a topic. Export all notes as a Markdown file for backup. Notes are plain text, not rendered HTML.
- The overview and study page show XP, levels, milestone badges, a daily quest of 10 new study questions, and a calendar-day streak. Topic badges on the study page track completion and 80%+ first-try accuracy.
- A new study question earns 15 XP when correct or 5 XP when missed. Each question earns once; resetting a domain preserves notes and rewards and cannot farm XP. Rewards start with attempts made after this feature was added; earlier answers remain intact. Quick quizzes and exams do not earn XP.
- Notes and rewards use the separate browser storage key `packetpath-learning-v1`. They are not uploaded or synced between devices. Clearing site data removes them; export your notebook regularly. Storage failures show a visible warning, and unsaved notes remain exportable while the page is open.
- Each question gets its own guide from `questionGuidance` in `guidance.js`, anchored to that exact question, its supplied values, and the kind of decision requested. Concept-specific reasoning and optional hints are selected from question wording, with topic metadata as a fallback. The guide does not read answer choices, correct indexes, explanations, lesson points, or lesson code.
- Evidence links are collapsed before submission and warn that reading external documentation can reveal the answer. After submission, the full lesson and reference list open. Sources support concepts, not a claim that Cisco reviewed this original question bank. Broad fallbacks are labeled as exam-scope reading, not specific answer verification.

## Assessment and career evidence

- A qualifying assessment is **full length (100 questions), timed (120 minutes), and hidden-feedback throughout**, with **at least 80/100 correct before rounding**. The threshold is a PacketPath practice target, not Cisco's official passing score. No assistance is required by the learning workflow, but this static app cannot verify that a user avoided external help.
- New completed exams store per-question correctness, concept group, domain, question type, settings, and duration. The latest 20 detailed records are retained in `assessments` within the existing `packetpath-ccna-progress-v1` storage key. The newest full timed hidden-feedback checkpoint is also retained as `latestAssessment`, so shorter practice attempts cannot evict it. Older summary-only attempts cannot qualify retroactively. The existing recent-attempt list remains limited to 10.
- The newest full timed hidden-feedback assessment controls the skills profile, even if it fails. A later failed assessment pauses resume/interview drafts; assisted, untimed, or shorter attempts do not replace that assessment.
- A concept requires at least **3 sampled questions and 80% correct** to support a conceptual-knowledge suggestion. Concept grouping is automatically mapped from wording/topic metadata; it is not a validated competency framework. Unsampled topics and small samples are not mastery evidence.
- Resume drafts identify the dated result as **self-administered practice**. CLI claims are limited to simplified simulator tasks actually graded correct. Nothing grants CCNA certification, proves production experience, or guarantees interview/job readiness.
- Interview cards combine a supported concept, its measured result, a discussion prompt, a preparation checklist, and credible reading. Export the career evidence and interview plan as Markdown after a qualifying pass.

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
- Question-level reasoning profiles and reference mappings: `guidance.js`. Primary-source catalog (URL, publisher, sections, domains, scope): `references.js`. Library filtering: `library.js`.
- Assessment policy, validation, and resume evidence: `assessment.js`; career-page rendering and export: `skills.js`. Shared resource/career styling: `resources.css`.

## Validate changes

In the standalone CCNA repository, run `node --test` for notebook persistence/export, XP deduplication, daily quests, streaks, storage errors, spoiler-free lessons across all 1000 study questions, reference mappings across both pools, and assessment policy/skills boundaries. No dependencies are needed.

## Where it's hosted

A copy lives in the portfolio repo at `public/apps/ccna/` and is served at <https://reid-json.net/apps/ccna/index.html>.
After changing files here, copy all `*.html`, `*.css` and `*.js` files into that folder in the [Portfolio](https://github.com/reid-json/Portfolio) repo and push.
