import { STORAGE_KEY, emptyState, localDate, streak, longestStreak, award, markRead, answerQuestion, finishQuiz, reviewAnswer, validateState, exportNotes, importNotes } from './state.js';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let state = emptyState();
let config, editions = [], articles = [], currentEdition;
let category = 'all', search = '', from = '', to = '', savedOrder = 'newest';
let noteQuery = '', noteArticle = null;
let storageBlocked = false;
const reviewSession = new Map();
function notice(message) { $('#notice').textContent = message; }
function save() {
  if (storageBlocked) { notice('The unreadable saved data was preserved. Export it from browser storage or import a valid backup before saving changes.'); return false; }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
  catch (error) { notice(`Your browser could not save changes: ${error.message}. Export a backup before leaving.`); return false; }
}
function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) state = validateState(JSON.parse(stored));
  } catch (error) { storageBlocked = true; notice(`Saved data could not be loaded: ${error.message}. It has not been overwritten. Import a valid backup from Progress.`); }
}
async function json(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
  return response.json();
}
const cat = id => config.categories.find(c => c.id === id);
const dateLabel = day => new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const articleLink = article => `#article/${article.id}`;
function tag(article) { return `<span class="category" style="--category:${cat(article.category).color}">${escape(cat(article.category).icon)} &nbsp; ${escape(cat(article.category).name)}</span>`; }
function favorite(article) {
  const saved = Boolean(state.favorites[article.id]);
  return `<button class="save-button" data-save="${article.id}" aria-pressed="${saved}" aria-label="${saved ? 'Unsave' : 'Save'} ${escape(article.title)}">${saved ? '&#9829; Saved' : '&#9825; Save'}</button>`;
}
function card(article, lead = false) {
  return `<article class="card ${lead ? 'lead-card' : ''}">
    <a href="${articleLink(article)}" tabindex="-1" aria-hidden="true"><img src="${article.image}" alt="" loading="${lead ? 'eager' : 'lazy'}" width="800" height="360"></a>
    <div class="card-copy"><div class="meta">${tag(article)}<span>${article.readMinutes} min read</span></div>
    <h${lead ? '2' : '3'}><a href="${articleLink(article)}">${escape(article.title)}</a></h${lead ? '2' : '3'}>
    <p>${escape(article.summary)}</p><div class="card-bottom"><span>${escape(article.label)}${state.read[article.id] ? ' / Read' : ''}</span>${favorite(article)}</div></div></article>`;
}
function filters(dateFilters = false, favorites = false) {
  return `<div class="filters" role="group" aria-label="Filter articles"><button data-category="all" aria-pressed="${category === 'all'}">All interests</button>${config.categories.map(c =>
    `<button data-category="${c.id}" aria-pressed="${category === c.id}">${escape(c.icon)} ${escape(c.name)}</button>`).join('')}</div>
    <div class="search-row"><label class="search-label">Search all words<input id="search" type="search" placeholder="A topic, a technique, a new idea..." value="${escape(search)}"></label>
    ${dateFilters ? `<label>From<input id="from" type="date" value="${escape(from)}"></label><label>To<input id="to" type="date" value="${escape(to)}"></label>` : ''}
    ${favorites ? `<label>Sort saved reads<select id="saved-order"><option value="newest" ${savedOrder === 'newest' ? 'selected' : ''}>Recently saved</option><option value="oldest" ${savedOrder === 'oldest' ? 'selected' : ''}>Oldest saved</option></select></label>` : ''}</div>`;
}
function filtered(list) {
  const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return list.filter(a => (category === 'all' || a.category === category) && (!from || a.date >= from) &&
    (!to || a.date <= to) && words.every(w => [a.title, ...a.body, ...a.tags].join(' ').toLowerCase().includes(w)));
}
function grid(list) { return list.length ? `<div class="grid">${list.map(a => card(a)).join('')}</div>` : '<div class="empty"><h2>A little room for discovery.</h2><p>No reads match these filters yet. Try another interest or search.</p></div>'; }
function heading(kicker, title, description = '') {
  return `<div class="page-heading"><p class="eyebrow">${escape(kicker)}</p><h1>${escape(title)}</h1>${description ? `<p>${escape(description)}</p>` : ''}</div>`;
}
function progressStrip() {
  const level = Math.floor(state.xp / 100) + 1;
  return `<aside class="progress-strip"><div><strong>${streak(state)} day${streak(state) === 1 ? '' : 's'}</strong><span>Your learning streak</span></div><div><strong>${state.xp} XP</strong><span>Level ${level} / ${level < 5 ? 'Curious reader' : level < 10 ? 'Thoughtful explorer' : 'Lifelong learner'}</span></div><div class="level-progress"><progress max="100" value="${state.xp % 100}" aria-label="Progress to next level"></progress><span>${100 - state.xp % 100} XP to your next chapter</span></div><a href="#progress">See your journey &rarr;</a></aside>`;
}
function todayPage(day) {
  const edition = day ? editions.find(e => e.date === day) : editions[0];
  if (!edition) return heading('The archive', 'That edition is not available.');
  currentEdition = edition;
  const list = edition.articles;
  const selected = filtered(list);
  const index = editions.indexOf(edition);
  const actualToday = localDate();
  const stale = edition.date < actualToday;
  const lead = selected.find(a => a.id === edition.conceptId) || selected[0];
  return `${heading(dateLabel(edition.date), 'Good morning. Stay curious.', 'A fresh cup. A quiet moment. Something worth knowing.')}
    ${edition.sample ? '<p class="banner">Sample edition: evergreen reading, not a reconstruction of historical news.</p>' : stale ? `<p class="banner">You're reading the latest available edition (${edition.date}). The next scheduled edition has not been published yet.</p>` : ''}
    ${progressStrip()}<div class="edition-nav"><span>THE MORNING EDITION / ${list.length} READS</span><div>${editions[index + 1] ? `<a href="#edition/${editions[index + 1].date}">&larr; Previous</a>` : ''} ${index > 0 ? `<a href="#edition/${editions[index - 1].date}">Next &rarr;</a>` : ''}</div></div>
    ${filters()}<div id="results">${lead ? `<div class="front-layout">${card(lead, true)}<aside class="daily-panel"><p class="eyebrow">A SMALL RITUAL</p><h2>Read. Reflect.<br>Let it sink in.</h2><p>Seven interests, one gentle invitation to learn. Every piece has a source and a place for your thoughts.</p><a class="primary" href="#challenge/${edition.date}">Try the daily challenge &rarr;</a><hr><p class="eyebrow">IDEA OF THE DAY</p><a class="idea-link" href="#article/${edition.ideaId}">${escape(list.find(a => a.id === edition.ideaId)?.title || 'A moment for reflection')}</a></aside></div><h2 class="section-title">A little more to explore</h2>${grid(selected.filter(a => a.id !== lead.id))}` : grid([])}</div>`;
}
function archivePage() {
  return `${heading('Keep a little history', 'The reading room.', 'Every edition stays here. Return to an old idea or find a new connection.')}
    <div class="date-list">${editions.map(e => `<a href="#edition/${e.date}">${escape(dateLabel(e.date))}<small>${e.articles.length} reads${e.sample ? ' / Sample' : ''}</small></a>`).join('')}</div>${filters(true)}<div id="results">${grid(filtered(articles))}</div>`;
}
function favoritesPage() {
  let list = articles.filter(a => state.favorites[a.id]);
  list.sort((a, b) => (savedOrder === 'newest' ? -1 : 1) * state.favorites[a.id].localeCompare(state.favorites[b.id]));
  return `${heading('Worth another visit', 'Your saved reads.', 'A small shelf of things that stayed with you.')}${filters(false, true)}<div id="results">${grid(filtered(list))}</div>`;
}
function quizMarkup(questions, review = false) {
  return questions.map(q => {
    const answer = review ? reviewSession.get(q.id) : state.attempts[q.id];
    return `<form class="question" data-quiz="${q.id}" ${review ? 'data-review="true"' : ''}>
      <fieldset ${answer ? 'disabled' : ''}><legend>${escape(q.prompt)}</legend>${q.options.map((option, i) =>
        `<label class="answer-option"><input type="radio" name="${q.id}" value="${i}" required ${answer?.selected === i ? 'checked' : ''}>${escape(option)}</label>`).join('')}</fieldset>
      ${answer ? `<div class="feedback ${answer.correct ? 'correct' : ''}" role="status"><strong>${answer.correct ? 'Exactly.' : 'A useful one to revisit.'}</strong> ${escape(q.explanation)}${!answer.correct ? `<p>Correct answer: ${escape(q.options[q.answer])}</p>` : ''}</div>` : '<button class="primary" type="submit">Check my answer</button>'}</form>`;
  }).join('');
}
function articlePage(id) {
  const article = articles.find(a => a.id === id);
  if (!article) return heading('A missing page', 'This article is not in the archive.');
  const notes = state.notes.filter(n => n.articleId === article.id);
  return `<article class="reading"><a href="#edition/${article.date}" class="back-link">&larr; ${escape(dateLabel(article.date))}</a>
    <div class="meta">${tag(article)}<span>${article.readMinutes} min read</span></div><h1>${escape(article.title)}</h1><p class="dek">${escape(article.summary)}</p>
    <div class="toolbar">${favorite(article)}<button data-note="${article.id}">Notes on this article (${notes.length})</button><button data-read="${article.id}" ${state.read[id] ? 'disabled' : ''}>${state.read[id] ? 'Read / 10 XP earned' : 'Mark as read +10 XP'}</button></div>
    <img class="article-image" src="${article.image}" alt="${escape(article.imageAlt)}" width="800" height="360">
    <p class="label">${escape(article.label)}${article.archiveReason ? ` / ${escape(article.archiveReason)}` : ''}</p>
    <div class="prose">${article.body.map(p => `<p>${escape(p)}</p>`).join('')}${article.code ? `<h2>Try this example</h2><pre><code>${escape(article.code)}</code></pre>` : ''}</div>
    ${article.category === 'health' ? '<aside class="banner">Educational information, not medical advice. Speak with a qualified professional about your individual needs.</aside>' : ''}
    <section class="sources"><h2>Follow the thread</h2><h3>Sources</h3><ul>${article.sources.map(s => `<li><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.site)} / ${escape(s.title)} &nearr;</a><small>Retrieved ${escape(s.retrievedAt.slice(0, 10))}</small></li>`).join('')}</ul></section>
    <section><p class="eyebrow">MAKE IT STICK</p><h2>A small check-in</h2><p>10 XP for reading. 5 XP for trying, 15 for a correct answer. Finish a quiz today for a streak day and 20 XP.</p>${quizMarkup(article.quiz)}</section>
    <section><h2>Your margin notes</h2>${notes.map(n => `<div class="note-preview"><h3>${escape(n.title)}</h3><p>${escape(n.body)}</p></div>`).join('') || '<p>No notes yet. Leave a thought for your future self.</p>'}<button data-note="${article.id}">Write a note</button></section></article>`;
}
function challengePage(day) {
  const edition = editions.find(e => e.date === day) || editions[0];
  currentEdition = edition;
  const questions = edition.articles.map(a => a.quiz[0]);
  const count = questions.filter(q => state.attempts[q.id]).length;
  return `<div class="reading">${heading(dateLabel(edition.date), 'A little daily challenge.', 'One question from every read. No timer, no pressure.')}<p>${count} of ${questions.length} answered. Article and daily questions share progress; replaying does not farm XP.</p><progress max="${questions.length}" value="${count}" aria-label="Daily challenge progress"></progress>${quizMarkup(questions)}</div>`;
}
function reviewPage() {
  const due = articles.flatMap(a => a.quiz).filter(q => state.reviewDue[q.id] && state.reviewDue[q.id] <= localDate());
  // Keep the just-answered flashcard visible for its explanation.
  const ids = new Set(due.map(q => q.id));
  for (const id of reviewSession.keys()) {
    const q = articles.flatMap(a => a.quiz).find(q => q.id === id);
    if (q && !ids.has(id)) due.push(q);
  }
  return `<div class="reading">${heading('A second look', 'Things worth revisiting.', 'Missed questions return here. Correct reviews return in three days; missed reviews return tomorrow. Reviews do not award repeat XP.')}
    ${due.length ? quizMarkup(due, true) : '<div class="empty"><h2>A clear desk.</h2><p>No reviews due today. A little space is part of learning, too.</p></div>'}</div>`;
}
function markdown(text) {
  // Deliberately small, safe subset. No HTML or embedded resources.
  return escape(text).split('\n').map(line => {
    const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
    return /^#{1,3} /.test(line) ? `<h3>${formatted.replace(/^#{1,3} /, '')}</h3>` : `<div>${formatted || '&nbsp;'}</div>`;
  }).join('');
}
function notebookPage() {
  const notes = state.notes.filter(n => [n.title, n.body].join(' ').toLowerCase().includes(noteQuery.toLowerCase()) && (!noteArticle || n.articleId === noteArticle))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return `${heading('A home for your thoughts', 'The notebook.', 'Private to this browser. A few words are enough to keep an idea alive.')}
    <div class="toolbar"><button id="new-note" class="primary">New note</button><button id="export-notes">Export Markdown</button><button id="import-notes-button">Import Markdown</button>${noteArticle ? '<button id="all-notes">Show all notes</button>' : ''}</div>
    <label class="search-label">Search notes<input id="note-search" type="search" value="${escape(noteQuery)}" placeholder="Find a thought..."></label>
    <div class="notebook-layout"><form id="note-form" class="note-editor"><h2 id="editor-heading">A new thought</h2><input type="hidden" name="id"><label>Title<input name="title" required maxlength="200" placeholder="Give this thought a name"></label><label>Note<textarea name="body" required rows="10" placeholder="Plain text, **bold**, # headings, and &#96;code&#96; are welcome."></textarea></label><input type="hidden" name="articleId" value="${escape(noteArticle || '')}"><p>New notes earn 5 XP, once per day. Editing never costs or awards XP.</p><button class="primary">Save note</button></form>
    <div>${notes.map(n => `<article class="note-card"><h2>${escape(n.title)}</h2><small>Updated ${escape(new Date(n.updatedAt).toLocaleString())}</small>${n.articleId && articles.find(a => a.id === n.articleId) ? `<p><a href="#article/${n.articleId}">Attached reading &rarr;</a></p>` : ''}<div class="note-body">${markdown(n.body)}</div><div class="toolbar"><button data-edit-note="${escape(n.id)}">Edit</button><button data-delete-note="${escape(n.id)}">Delete</button></div></article>`).join('') || '<div class="empty"><h2>A blank page, in the best way.</h2><p>Your thoughts belong here.</p></div>'}</div></div>`;
}
function progressPage() {
  const attempts = Object.values(state.attempts);
  const correct = attempts.filter(a => a.correct).length;
  const names = { tech: 'Signal Finder', coding: 'Code Wizard', guitar: 'Riff Master', music: 'Deep Listener', philosophy: 'Bookworm', health: 'Iron Will', anime: 'Otaku Scholar' };
  const badges = config.categories.map(c => ({ name: names[c.id], earned: attempts.filter(a => a.category === c.id && a.correct).length >= 5, detail: '5 correct ' + c.name + ' answers' }));
  badges.push({ name: 'A Week of Wonder', earned: longestStreak(state) >= 7, detail: '7-day streak achieved' }, { name: 'A Hundred Questions', earned: attempts.length >= 100, detail: '100 answered questions' });
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return localDate(d); });
  const max = Math.max(1, ...days.map(d => state.activity[d] || 0));
  return `${heading('Small steps add up', 'Your quiet progress.', 'Not a leaderboard. Just a record of showing up for your own curiosity.')}${progressStrip()}
    <div class="stats"><div><strong>${Object.keys(state.read).length}</strong>reads completed</div><div><strong>${attempts.length}</strong>questions explored</div><div><strong>${attempts.length ? Math.round(correct / attempts.length * 100) : 0}%</strong>first-answer accuracy</div><div><strong>${state.notes.length}</strong>notes kept</div></div>
    <section class="panel"><h2>This week's little moments</h2><div class="chart" role="img" aria-label="${escape(days.map(d => `${d}: ${state.activity[d] || 0} XP`).join(', '))}">${days.map(d => `<div><span>${state.activity[d] || 0}</span><i style="height:${Math.max(3, (state.activity[d] || 0) / max * 100)}px"></i><small>${d.slice(5)}</small></div>`).join('')}</div></section>
    <div class="grid two"><section class="panel"><h2>Your interests, in practice</h2>${config.categories.map(c => { const list = attempts.filter(a => a.category === c.id); const right = list.filter(a => a.correct).length; return `<div class="accuracy"><span>${escape(c.name)}</span><strong>${right}/${list.length}</strong><progress max="${Math.max(1, list.length)}" value="${right}" aria-label="${escape(c.name)} accuracy"></progress></div>`; }).join('')}</section>
    <section class="panel"><h2>Little milestones</h2><div class="badges">${badges.map(b => `<div class="badge ${b.earned ? 'earned' : ''}"><strong>${b.earned ? '&#10003;' : '&#9675;'} ${b.name}</strong><small>${b.detail}</small></div>`).join('')}</div></section></div>
    <section class="panel"><h2>Keep a copy of your corner of the internet.</h2><p>Backup includes favorites, notes, XP, quiz answers, read state, theme, streaks, and review dates. Import replaces this browser's data after confirmation. There is no cross-device sync.</p><div class="toolbar"><button id="backup" class="primary">Export full backup</button><button id="restore">Import full backup</button></div></section>`;
}
function route() {
  const [page = 'today', id] = location.hash.slice(1).split('/');
  document.documentElement.dataset.theme = state.theme;
  $('#theme').textContent = state.theme === 'light' ? 'Dark mode' : 'Light mode';
  for (const a of $('#nav').querySelectorAll('a')) a.setAttribute('aria-current', a.hash.slice(1) === page ? 'page' : 'false');
  const routes = { today: () => todayPage(), edition: () => todayPage(id), archive: archivePage,
    favorites: favoritesPage, article: () => articlePage(id), notebook: notebookPage,
    challenge: () => challengePage(id), review: reviewPage, progress: progressPage };
  $('#main').innerHTML = (routes[page] || routes.today)();
}
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function findQuestion(id) {
  for (const article of articles) {
    const question = article.quiz.find(q => q.id === id);
    if (question) return { question, article };
  }
  throw new Error('This question is no longer in the archive.');
}
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.id === 'theme') { state.theme = state.theme === 'light' ? 'dark' : 'light'; save(); route(); }
  if (button.dataset.category) { category = button.dataset.category; route(); }
  if (button.dataset.save) {
    const id = button.dataset.save;
    if (state.favorites[id]) delete state.favorites[id]; else state.favorites[id] = new Date().toISOString();
    save(); route();
  }
  if (button.dataset.read) { if (markRead(state, button.dataset.read)) { save(); notice('A little more learned. +10 XP'); } route(); }
  if (button.dataset.note) { noteArticle = button.dataset.note; noteQuery = ''; if (location.hash === '#notebook') route(); else location.hash = '#notebook'; }
  if (button.id === 'new-note') { $('#note-form').reset(); $('#note-form [name=articleId]').value = noteArticle || ''; $('#editor-heading').textContent = 'A new thought'; $('#note-form [name=title]').focus(); }
  if (button.id === 'all-notes') { noteArticle = null; route(); }
  if (button.dataset.editNote) {
    const note = state.notes.find(n => n.id === button.dataset.editNote);
    const form = $('#note-form');
    for (const key of ['id', 'title', 'body', 'articleId']) form.elements.namedItem(key).value = note[key] || '';
    $('#editor-heading').textContent = 'Revisit a thought'; form.elements.namedItem('title').focus();
  }
  if (button.dataset.deleteNote && confirm('Delete this note? Export your notebook first if you want to keep a copy.')) {
    state.notes = state.notes.filter(n => n.id !== button.dataset.deleteNote); save(); route();
  }
  if (button.id === 'export-notes') download('morning-pages-notebook.md', exportNotes(state.notes), 'text/markdown');
  if (button.id === 'import-notes-button') $('#import-notes').click();
  if (button.id === 'backup') download(`morning-pages-${localDate()}.json`, JSON.stringify(state, null, 2), 'application/json');
  if (button.id === 'restore') $('#import').click();
});
document.addEventListener('submit', event => {
  if (event.target.matches('#note-form')) {
    event.preventDefault();
    const form = new FormData(event.target);
    const title = String(form.get('title')).trim(), body = String(form.get('body')).trim();
    if (!title || !body) { notice('Give your note a title and a little text.'); return; }
    const id = form.get('id');
    const existing = state.notes.find(n => n.id === id);
    const now = new Date().toISOString();
    if (existing) Object.assign(existing, { title, body, updatedAt: now });
    else {
      const rewardedToday = state.noteDays.includes(localDate());
      state.notes.push({ id: crypto.randomUUID(), title, body, articleId: form.get('articleId') || null, createdAt: now, updatedAt: now });
      if (!rewardedToday) { award(state, 5); state.noteDays.push(localDate()); }
    }
    if (save()) notice('Your thought is safely on the page.');
    route();
  }
  if (event.target.dataset.quiz) {
    event.preventDefault();
    const form = event.target;
    const selected = new FormData(form).get(form.dataset.quiz);
    if (selected === null) { notice('Choose an answer first.'); return; }
    const { question, article } = findQuestion(form.dataset.quiz);
    if (form.dataset.review) {
      const correct = reviewAnswer(state, question, Number(selected));
      reviewSession.set(question.id, { selected: Number(selected), correct });
    } else {
      answerQuestion(state, question, Number(selected), article.category);
      if (location.hash.startsWith('#challenge')) finishQuiz(state, currentEdition.articles.map(a => a.quiz[0]));
      else finishQuiz(state, article.quiz);
    }
    save(); route();
  }
});
document.addEventListener('input', event => {
  const input = event.target;
  const cursor = input.selectionStart;
  const mappings = { search: v => search = v, from: v => from = v, to: v => to = v, 'note-search': v => noteQuery = v };
  if (mappings[input.id]) {
    mappings[input.id](input.value); route();
    const replacement = document.getElementById(input.id);
    replacement.focus();
    if (['search', 'note-search'].includes(input.id) && cursor !== null) replacement.setSelectionRange(cursor, cursor);
  }
});
document.addEventListener('change', async event => {
  const input = event.target;
  if (input.id === 'saved-order') { savedOrder = input.value; route(); }
  if (!['import', 'import-notes'].includes(input.id) || !input.files?.length) return;
  try {
    const text = await input.files[0].text();
    if (input.id === 'import') {
      const backup = validateState(JSON.parse(text));
      if (!confirm('Replace all Morning Pages data in this browser with this backup?')) return;
      state = backup; storageBlocked = false; reviewSession.clear();
    } else {
      const notes = importNotes(text);
      const map = new Map(state.notes.map(n => [n.id, n]));
      for (const note of notes) map.set(note.id, note);
      state.notes = [...map.values()];
    }
    if (save()) notice('Import complete.');
    route();
  } catch (error) { notice(`Import was not applied: ${error.message}`); }
  finally { input.value = ''; }
});
window.addEventListener('hashchange', () => {
  category = 'all'; search = ''; from = ''; to = '';
  route(); window.scrollTo(0, 0); $('#main').focus({ preventScroll: true });
});
async function start() {
  loadState();
  config = await json('config.json');
  document.title = `${config.title} | A little curiosity, every day`;
  const index = await json('content/index.json');
  editions = await Promise.all(index.map(e => json(`content/${e.date}/edition.json`)));
  const unique = new Map();
  for (const edition of editions) for (const article of edition.articles) if (!unique.has(article.id)) unique.set(article.id, article);
  articles = [...unique.values()];
  if (!editions.length) throw new Error('No editions have been published yet.');
  route();
}
start().catch(error => {
  $('#main').innerHTML = `<div class="empty"><h1>The reading room could not open.</h1><p>${escape(error.message)}</p><p>Serve this folder over HTTP, then reload. Your saved data has not been changed.</p><button onclick="location.reload()">Try again</button></div>`;
});
